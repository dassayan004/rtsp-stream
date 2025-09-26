"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { removeStream } from "@/firebase/service";

export const StreamPresence = ({ streamId }: { streamId: string | null }) => {
  const pathname = usePathname();
  useEffect(() => {
    if (!streamId) return;

    const markInactive = () => {
      removeStream(streamId).catch((err) => {
        console.error("Failed to remove stream on disconnect:", err);
      });
    };

    window.addEventListener("beforeunload", markInactive);
    markInactive();

    return () => {
      window.removeEventListener("beforeunload", markInactive);

      markInactive();
    };
  }, [streamId, pathname]);

  return null;
};
