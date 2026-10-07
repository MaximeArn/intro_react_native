import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

type Props = {
  name: string;
  uri?: string | null;
  size?: number;
};

export default function Avatar({ name, uri, size = 56 }: Props) {
  const shape = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return (
      <Image
        testID="avatar-image"
        source={{ uri }}
        style={[styles.image, shape]}
        contentFit="cover"
        transition={200}
      />
    );
  }

  return (
    <View testID="avatar-initial" style={[styles.placeholder, shape]}>
      <Text style={[styles.initial, { fontSize: size * 0.42 }]}>
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceMuted,
  },
  placeholder: {
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    fontWeight: "800",
    color: colors.primary,
  },
});
