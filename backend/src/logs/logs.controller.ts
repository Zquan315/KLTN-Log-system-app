import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { LogsService } from './logs.service';
import { stringify } from 'csv-stringify/sync';

@Controller('logs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LogsController {
  constructor(private readonly svc: LogsService) {}

  @Get()
  @Roles('admin','read')
  list(
    @Query('q') q?: string,
    @Query('label') label?: 'attack'|'benign',
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.svc.list({
      q,
      label,
      from: from ? Number(from) : undefined,
      to: to ? Number(to) : undefined,
      limit: limit ? Number(limit) : undefined,
      cursor,
    });
  }

  @Get('export')
  @Roles('admin','read')
  async exportCsv(
    @Res() res: Response,
    @Query('q') q?: string, 
    @Query('label') label?: 'attack'|'benign',
    @Query('from') from?: string, 
    @Query('to') to?: string,
    @Query('limit') limit?: string, 
    @Query('cursor') cursor?: string,
    
  ) {
    const { items } = await this.svc.list({
      q, label,
      from: from ? Number(from) : undefined,
      to: to ? Number(to) : undefined,
      limit: limit ? Number(limit) : 1000, // export tối đa 1000
      cursor,
    });
    const csv = stringify(items, { header: true });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="logs.csv"');
    res.send(csv);
  }
}
