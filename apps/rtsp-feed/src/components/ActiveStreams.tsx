"use client";

import { StreamPresence } from "@/hooks/use-stream-inactive-on-close";
import { usePaths } from "@/hooks/useMediamtx";

export default function ActiveStreams() {
  const { data, isLoading, error } = usePaths();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading streams</p>;

  const firstStreamId = data?.items[0]?.name ?? null;
  return (
    <>
      {firstStreamId && <StreamPresence streamId={firstStreamId} />}

      <ul>
        {data?.items.map((item) => (
          <li key={item.name}>
            {item.name} — {item.ready ? "Ready" : "Not Ready"}
          </li>
        ))}
      </ul>
    </>
  );
}
