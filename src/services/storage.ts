import {
  deleteObject,
  getDownloadURL,
  putFile,
  ref,
  storage,
} from "@/services/firebase";

export async function uploadImage(localUri: string, path: string) {
  const imageRef = ref(storage, path);
  await putFile(imageRef, localUri, { contentType: "image/jpeg" });
  return getDownloadURL(imageRef);
}

export async function deleteImage(url: string) {
  await deleteObject(ref(storage, url));
}
