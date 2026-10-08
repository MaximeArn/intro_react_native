import * as ImagePicker from "expo-image-picker";

// Ouvre la galerie et renvoie l'URI locale de l'image choisie (null si annulé)
export async function pickImageFromLibrary(
  aspect: [number, number] = [1, 1],
): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: "images",
    allowsEditing: true,
    aspect,
    quality: 0.5,
  });
  return result.canceled ? null : result.assets[0].uri;
}
