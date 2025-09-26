"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { markCameraInactive } from "@/firebase/service";

export const StreamPresence = ({ cameraId }: { cameraId: string | null }) => {
  const pathname = usePathname();
  useEffect(() => {
    if (!cameraId) return;

    const markInactive = () => {
      markCameraInactive(cameraId).catch((err) => {
        console.error("Failed to remove stream on disconnect:", err);
      });
    };

    window.addEventListener("beforeunload", markInactive);
    markInactive();

    return () => {
      window.removeEventListener("beforeunload", markInactive);

      markInactive();
    };
  }, [cameraId, pathname]);

  return null;
};
