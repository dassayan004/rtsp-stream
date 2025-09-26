import { ref, runTransaction } from "firebase/database";
import firebaseDatabase from "./firebase";
import { CameraState } from "@/lib/utils";

export const addActiveStream = async (streamId: string) => {
  const cameraRef = ref(firebaseDatabase, "/CameraState");

  try {
    await runTransaction(cameraRef, (currentState: CameraState | null) => {
      const active = currentState?.active || [];
      if (!active.includes(streamId)) {
        active.push(streamId);
      }
      return { active };
    });
    console.log(`Stream ${streamId} added to active`);
  } catch (err) {
    console.error("Failed to add active stream:", err);
  }
};

export const removeStream = async (streamId: string) => {
  const cameraRef = ref(firebaseDatabase, "/CameraState");

  try {
    await runTransaction(cameraRef, (currentState: CameraState | null) => {
      const active = (currentState?.active || []).filter(
        (id) => id !== streamId
      );
      return { active };
    });
    console.log(`Stream ${streamId} was removed`);
  } catch (err) {
    console.error("Failed to remove stream:", err);
  }
};
