import { StyleSheet, Text, View } from "react-native";

import { typography } from "@/constants/theme";

export default function List() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.heading,
  },
});
