import { Body, Controller, Get, Post } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { StartStreamResponse, StreamListResponse } from '@/common/types';
import { StartStreamDTO, StopStreamDTO } from './dto/create-streaming.dto';

@Controller('streaming')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @Get('active')
  async getActivePaths(): Promise<StreamListResponse> {
    return await this.streamingService.listActivePaths();
  }

  @Post('start')
  async startStream(@Body() dto: StartStreamDTO): Promise<StartStreamResponse> {
    return await this.streamingService.startStream(dto);
  }

  @Post('stop')
  async stopStream(
    @Body() { streamId }: StopStreamDTO,
  ): Promise<{ success: boolean }> {
    return await this.streamingService.stopStream(streamId);
  }
}
