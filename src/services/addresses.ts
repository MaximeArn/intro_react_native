import {
  auth,
  collection,
  db,
  deleteDoc,
  doc,
  GeoPoint,
  onSnapshot,
  query,
  type QuerySnapshot,
  serverTimestamp,
  setDoc,
  where,
} from "@/services/firebase";
import { deleteImage, uploadImage } from "@/services/storage";
import type { Address, NewAddress } from "@/types/address";

export const ADDRESSES_COLLECTION = "addresses";

const addressesRef = () => collection(db, ADDRESSES_COLLECTION);

export async function createAddress(input: NewAddress): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw Object.assign(new Error(), { code: "auth/no-current-user" });

  const addressRef = doc(addressesRef());

  const photoURL = input.localPhotoUri
    ? await uploadImage(
        input.localPhotoUri,
        `addresses/${user.uid}/${addressRef.id}/${Date.now()}.jpg`,
      )
    : null;

  try {
    await setDoc(addressRef, {
      ownerId: user.uid,
      ownerName: user.displayName || user.email || "",
      name: input.name,
      description: input.description,
      photoURL,
      isPublic: input.isPublic,
      location: new GeoPoint(input.location.latitude, input.location.longitude),
      formattedAddress: input.formattedAddress,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    if (photoURL) deleteImage(photoURL).catch(() => {});
    throw error;
  }

  return addressRef.id;
}

export async function deleteAddress(address: Address): Promise<void> {
  await deleteDoc(doc(db, ADDRESSES_COLLECTION, address.id));
  if (address.photoURL) deleteImage(address.photoURL).catch(() => {});
}

const toAddresses = (snapshot: QuerySnapshot) =>
  snapshot.docs.map((document): Address => {
    const data = document.data({ serverTimestamps: "estimate" });
    return {
      id: document.id,
      ownerId: data.ownerId,
      ownerName: data.ownerName,
      name: data.name,
      description: data.description,
      photoURL: data.photoURL ?? null,
      isPublic: data.isPublic,
      location: {
        latitude: data.location.latitude,
        longitude: data.location.longitude,
      },
      formattedAddress: data.formattedAddress ?? null,
      createdAt: data.createdAt?.toDate() ?? null,
    };
  });

export function subscribeToVisibleAddresses(
  userId: string,
  onChange: (addresses: Address[]) => void,
  onError: (error: unknown) => void,
): () => void {
  let publicAddresses: Address[] | null = null;
  let ownAddresses: Address[] | null = null;

  const emit = () => {
    if (!publicAddresses || !ownAddresses) return;
    const byId = new Map(
      [...publicAddresses, ...ownAddresses].map((address) => [
        address.id,
        address,
      ]),
    );
    const merged = [...byId.values()].sort(
      (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    );
    onChange(merged);
  };

  const unsubscribePublic = onSnapshot(
    query(addressesRef(), where("isPublic", "==", true)),
    (snapshot) => {
      publicAddresses = toAddresses(snapshot);
      emit();
    },
    onError,
  );
  const unsubscribeOwn = onSnapshot(
    query(addressesRef(), where("ownerId", "==", userId)),
    (snapshot) => {
      ownAddresses = toAddresses(snapshot);
      emit();
    },
    onError,
  );

  return () => {
    unsubscribePublic();
    unsubscribeOwn();
  };
}
