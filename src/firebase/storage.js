import { storage } from "./config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Upload file to Firebase Storage and return download URL
export const uploadFile = async (file, path) => {
  if (!file) return null;
  const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};
