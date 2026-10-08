import type { Coordinates } from "@/hooks/use-user-location";

export type Address = {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  description: string;
  photoURL: string | null;
  isPublic: boolean;
  location: Coordinates;
  formattedAddress: string | null;
  createdAt: Date | null;
};

export type NewAddress = Pick<
  Address,
  "name" | "description" | "isPublic" | "location" | "formattedAddress"
> & {
  localPhotoUri: string | null;
};
