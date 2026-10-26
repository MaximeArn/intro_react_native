import {
  auth,
  collection,
  db,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  type QuerySnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "@/services/firebase";
import { deleteImage, uploadImage } from "@/services/storage";
import type { Comment, NewComment } from "@/types/comment";

const commentsRef = (addressId: string) =>
  collection(db, "addresses", addressId, "comments");

export async function createComment(
  addressId: string,
  input: NewComment,
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw Object.assign(new Error(), { code: "auth/no-current-user" });

  const commentRef = doc(commentsRef(addressId));

  const photoURL = input.localPhotoUri
    ? await uploadImage(
        input.localPhotoUri,
        `comments/${user.uid}/${addressId}/${commentRef.id}.jpg`,
      )
    : null;

  try {
    await setDoc(commentRef, {
      authorId: user.uid,
      authorName: user.displayName || user.email || "",
      authorPhotoURL: user.photoURL ?? null,
      rating: input.rating,
      text: input.text,
      photoURL,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    if (photoURL) deleteImage(photoURL).catch(() => {});
    throw error;
  }
}

export async function deleteComment(
  addressId: string,
  comment: Comment,
): Promise<void> {
  await deleteDoc(doc(commentsRef(addressId), comment.id));
  if (comment.photoURL) deleteImage(comment.photoURL).catch(() => {});
}

// Firestore ne supprime pas les sous-collections avec leur document parent :
// à appeler avant de supprimer l'adresse (les règles lisent encore l'adresse)
export async function deleteAllComments(addressId: string): Promise<void> {
  const snapshot = await getDocs(commentsRef(addressId));
  if (snapshot.empty) return;

  const batch = writeBatch(db);
  snapshot.docs.forEach((document) => batch.delete(document.ref));
  await batch.commit();

  snapshot.docs.forEach((document) => {
    const photoURL = document.data().photoURL;
    if (photoURL) deleteImage(photoURL).catch(() => {});
  });
}

const toComments = (snapshot: QuerySnapshot) =>
  snapshot.docs.map((document): Comment => {
    const data = document.data({ serverTimestamps: "estimate" });
    return {
      id: document.id,
      authorId: data.authorId,
      authorName: data.authorName,
      authorPhotoURL: data.authorPhotoURL ?? null,
      rating: data.rating,
      text: data.text,
      photoURL: data.photoURL ?? null,
      createdAt: data.createdAt?.toDate() ?? null,
    };
  });

export function subscribeToComments(
  addressId: string,
  onChange: (comments: Comment[]) => void,
  onError: (error: unknown) => void,
): () => void {
  return onSnapshot(
    query(commentsRef(addressId), orderBy("createdAt", "desc")),
    (snapshot) => onChange(toComments(snapshot)),
    onError,
  );
}
