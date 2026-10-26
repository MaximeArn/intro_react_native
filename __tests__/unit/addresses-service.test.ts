import { createAddress } from "@/services/addresses";
import { auth, setDoc } from "@/services/firebase";
import { deleteImage, uploadImage } from "@/services/storage";

jest.mock("@/services/firebase", () => ({
  auth: { currentUser: { uid: "me", displayName: "Moi" } },
  db: {},
  collection: jest.fn(),
  doc: jest.fn(() => ({ id: "address-1" })),
  GeoPoint: jest.fn(),
  serverTimestamp: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock("@/services/storage", () => ({
  uploadImage: jest.fn(() => "https://photo.jpg"),
  deleteImage: jest.fn(() => Promise.resolve()),
}));

jest.mock("@/services/comments", () => ({}));

const newAddress = {
  name: "La boulangerie",
  description: "",
  isPublic: true,
  location: { latitude: 45.76, longitude: 4.83 },
  formattedAddress: null,
  localPhotoUri: null,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createAddress", () => {
  test("enregistre l'adresse au nom de l'utilisateur connecté", async () => {
    await createAddress(newAddress);

    expect(setDoc).toHaveBeenCalledWith(
      { id: "address-1" },
      expect.objectContaining({
        ownerId: "me",
        ownerName: "Moi",
        name: "La boulangerie",
        isPublic: true,
      }),
    );
  });

  test("envoie la photo avant d'enregistrer l'adresse", async () => {
    await createAddress({ ...newAddress, localPhotoUri: "file:///photo.jpg" });

    expect(uploadImage).toHaveBeenCalled();
    expect(setDoc).toHaveBeenCalledWith(
      { id: "address-1" },
      expect.objectContaining({ photoURL: "https://photo.jpg" }),
    );
  });

  test("supprime la photo si l'adresse est refusée par Firestore", async () => {
    jest.mocked(setDoc).mockRejectedValueOnce(new Error("refusé"));

    await expect(
      createAddress({ ...newAddress, localPhotoUri: "file:///photo.jpg" }),
    ).rejects.toThrow("refusé");

    expect(deleteImage).toHaveBeenCalledWith("https://photo.jpg");
  });

  test("refuse la création si personne n'est connecté", async () => {
    const user = auth.currentUser;
    Object.assign(auth, { currentUser: null });

    await expect(createAddress(newAddress)).rejects.toBeDefined();
    expect(setDoc).not.toHaveBeenCalled();

    Object.assign(auth, { currentUser: user });
  });
});
