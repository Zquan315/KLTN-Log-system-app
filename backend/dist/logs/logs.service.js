"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsService = void 0;
const common_1 = require("@nestjs/common");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
function encodeCursor(key) {
    return key ? Buffer.from(JSON.stringify(key)).toString('base64') : null;
}
function decodeCursor(cur) {
    return cur ? JSON.parse(Buffer.from(cur, 'base64').toString()) : undefined;
}
let LogsService = class LogsService {
    constructor() {
        this.table = process.env.DDB_TABLE;
        const client = new client_dynamodb_1.DynamoDBClient({ region: process.env.AWS_REGION });
        this.doc = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
    }
    async list(params) {
        const limit = params.limit ?? 20;
        if (params.label) {
            const cmd = new lib_dynamodb_1.QueryCommand({
                TableName: this.table,
                IndexName: 'gsi_label',
                KeyConditionExpression: '#l = :label AND #ts BETWEEN :from AND :to',
                ExpressionAttributeNames: { '#l': 'label', '#ts': 'ts' },
                ExpressionAttributeValues: {
                    ':label': params.label,
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
        if (params.q) {
            const cmd = new lib_dynamodb_1.QueryCommand({
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
        const cmd = new lib_dynamodb_1.QueryCommand({
            TableName: this.table,
            KeyConditionExpression: '#pk = :p AND #ts BETWEEN :from AND :to',
            ExpressionAttributeNames: { '#pk': 'pk', '#ts': 'ts' },
            ExpressionAttributeValues: {
                ':p': 'LOG',
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
};
exports.LogsService = LogsService;
exports.LogsService = LogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LogsService);
//# sourceMappingURL=logs.service.js.map