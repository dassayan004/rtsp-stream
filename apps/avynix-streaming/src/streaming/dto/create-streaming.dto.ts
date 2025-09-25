import { Protocol } from '@/common/enum/protocol.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartStreamDTO {
  @ApiProperty({
    description: 'RTSP URL of the stream to start',
    example: 'rtsp://username:password@camera-ip:554/stream',
  })
  @IsNotEmpty()
  @IsString()
  rtspUrl: string;

  @ApiProperty({
    description: 'Streaming protocol',
    enum: Protocol,
    example: Protocol.HLS,
  })
  @IsEnum(Protocol)
  protocol: Protocol;
}

export class StopStreamDTO {
  @ApiProperty({
    description: 'The path of the stream to stop',
    example: 'stream_1695654321000',
  })
  @IsNotEmpty()
  @IsString()
  path: string;
}
