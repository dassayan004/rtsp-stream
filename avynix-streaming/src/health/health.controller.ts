import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    // private ormIndicator: MongooseHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return await this.health.check([
      // async () =>
      //   await this.ormIndicator.pingCheck('database', {
      //     timeout: 1500,
      //   }),
      async () =>
        await this.memory.checkHeap('memory_heap', 1000 * 1024 * 1024),
      async () => await this.memory.checkRSS('memory_RSS', 1000 * 1024 * 1024),
      async () =>
        await this.disk.checkStorage('disk_health', {
          thresholdPercent: 10,
          path: '/',
        }),
      async () =>
        await this.http.pingCheck('app_health', 'https://www.nestjs.com/'),
    ]);
  }
}
