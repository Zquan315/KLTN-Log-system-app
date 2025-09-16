import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

function encodeCursor(key?: Record<string, any>) {
  return key ? Buffer.from(JSON.stringify(key)).toString('base64') : null;
}
function decodeCursor(cur?: string) {
  return cur ? JSON.parse(Buffer.from(cur, 'base64').toString()) : undefined;
}

@Injectable()
export class LogsService {
  private doc: DynamoDBDocumentClient;
  private table = process.env.DDB_TABLE!;

  constructor() {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    this.doc = DynamoDBDocumentClient.from(client);
  }

  async list(params: {
    q?: string; label?: 'attack'|'benign';
    from?: number; to?: number; limit?: number; cursor?: string;
  }) {
    const limit = params.limit ?? 20;

    // Ba trường hợp query:
    // 1) label + time => GSI label
    if (params.label) {
      const cmd = new QueryCommand({
        TableName: this.table,
        IndexName: 'gsi_label',
        KeyConditionExpression: '#l = :label AND #ts BETWEEN :from AND :to',
        ExpressionAttributeNames: { '#l': 'label', '#ts': 'ts' },
        ExpressionAttributeValues: {
          ':label': params.label,
          ':from': params.from ?? 0,
          ':to'  : params.to ?? Date.now(),
        },
        Limit: limit,
        ExclusiveStartKey: decodeCursor(params.cursor),
        ScanIndexForward: false, // mới nhất trước
      });
      const res = await this.doc.send(cmd);
      return { items: res.Items ?? [], nextCursor: encodeCursor(res.LastEvaluatedKey) };
    }

    // 2) q (search theo key) + time => GSI key
    if (params.q) {
      const cmd = new QueryCommand({
        TableName: this.table,
        IndexName: 'gsi_key',
        KeyConditionExpression: '#k = :key AND #ts BETWEEN :from AND :to',
        ExpressionAttributeNames: { '#k': 'key', '#ts': 'ts' },
        ExpressionAttributeValues: {
          ':key': params.q,
          ':from': params.from ?? 0,
          ':to': params.to ?? Date.now(),
        },
        Limit: limit,
        ExclusiveStartKey: decodeCursor(params.cursor),
        ScanIndexForward: false,
      });
      const res = await this.doc.send(cmd);
      return { items: res.Items ?? [], nextCursor: encodeCursor(res.LastEvaluatedKey) };
    }

    // 3) Không filter -> query theo PK "LOG" + time
    const cmd = new QueryCommand({
      TableName: this.table,
      KeyConditionExpression: '#pk = :p AND #ts BETWEEN :from AND :to',
      ExpressionAttributeNames: { '#pk': 'pk', '#ts': 'ts' },
      ExpressionAttributeValues: {
        ':p'   : 'LOG',
        ':from': params.from ?? 0,
        ':to'  : params.to ?? Date.now(),
      },
      Limit: limit,
      ExclusiveStartKey: decodeCursor(params.cursor),
      ScanIndexForward: false,
    });
    const res = await this.doc.send(cmd);
    return { items: res.Items ?? [], nextCursor: encodeCursor(res.LastEvaluatedKey) };
  }
}
