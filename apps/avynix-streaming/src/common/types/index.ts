import { Protocol } from '../enum/protocol.enum';

export interface StartStreamResponse {
  streamId: string;
  protocol: Protocol;
  url: string;
}

export interface PathConfig {
  source: string;
  sourceOnDemand?: boolean;
  sourceOnDemandStartTimeout?: string;
  maxReaders?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface GlobalConfigUpdate {
  [key: string]: string | number | boolean | undefined;
}

export interface StreamItem {
  name: string;
  confName: string;
  source: {
    type: string;
    id: string;
  };
  ready: boolean;
  readyTime: string | null;
  tracks: any[];
  bytesReceived: number;
  bytesSent: number;
  readers: any[];
}

export interface StreamListResponse {
  itemCount: number;
  pageCount: number;
  items: StreamItem[];
}

export interface CameraDevice {
  id: string;
  name: string;
  rtsp_url: string;
  isActive: boolean;
  isStreaming: boolean;
  users: string[];
  stream_id_hls?: string;
  stream_id_webrtc?: string;
  hls_url?: string;
  webrtc_url?: string;
}
