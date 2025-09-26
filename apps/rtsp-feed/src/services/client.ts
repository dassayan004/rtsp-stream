"use client";
import {
  StartStreamDTO,
  StartStreamResponse,
  StreamListResponse,
} from "@/lib/utils";
import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_MEDIAMTX_CONTROL_BASE ?? "http://localhost:5000",
});

// ---- PATHS ----
export async function listPaths(): Promise<StreamListResponse> {
  const { data } = await apiClient.get<StreamListResponse>("/streaming/active");
  return data;
}

export async function startStream({
  protocol,
  rtspUrl,
}: StartStreamDTO): Promise<StartStreamResponse> {
  const { data } = await apiClient.post<StartStreamResponse>(
    "/streaming/start",
    {
      protocol,
      rtspUrl,
    }
  );
  return data;
}
