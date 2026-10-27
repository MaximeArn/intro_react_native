import { view } from "./storybook.requires";

// Stockage en mémoire : évite d'ajouter AsyncStorage (module natif) juste
// pour retenir la dernière story ouverte
const memory = new Map<string, string>();

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => {
      memory.set(key, value);
    },
  },
});

export default StorybookUIRoot;
