import { FlatList, StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import IngredientCard from "../../components/ingredient-card";
import { data as ingredients } from "../../data/data.json";

const Home = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <FlatList
        data={ingredients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <IngredientCard ingredient={item} />}
      />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
});

export default Home;
