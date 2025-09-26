import { markCameraInactive } from "@/firebase/service";
import {
  AxiosServerError,
  StartStreamDTO,
  StartStreamResponse,
  StreamListResponse,
} from "@/lib/utils";
import { listPaths, startStream } from "@/services/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePaths() {
  return useQuery<StreamListResponse>({
    queryKey: ["paths"],
    queryFn: listPaths,
    refetchInterval: 10000,
  });
}

// Start a new stream
export function useStartStream() {
  const qc = useQueryClient();

  return useMutation<StartStreamResponse, AxiosServerError, StartStreamDTO>({
    mutationFn: (dto: StartStreamDTO) => startStream(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["paths"] }),
    onError: (error) => {
      const errorMsg = error.response?.data.message || error.message;
      console.log("Error starting stream:", errorMsg);
      alert(errorMsg);
    },
  });
}
// Stop a stream
export function useCameraInactive() {
  return useMutation({
    mutationFn: (streamId: string) => markCameraInactive(streamId),
  });
}
