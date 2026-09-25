const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./supinfo-test-b4a73-firebase-adminsdk-fbsvc-60d5dcef42.json");

// Initialiser l'application Firebase Admin (SDK Node, pas @react-native-firebase)
initializeApp({
  credential: cert(serviceAccount),
});

const firestore = getFirestore();

// Chemin vers votre fichier JSON
const data = require("./data.json").data;

// Firestore limite un batch à 500 opérations
const BATCH_SIZE = 500;

// Fonction pour importer les données dans Firestore
const importData = async () => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("data.json ne contient aucune donnée dans la clé 'data'");
  }

  const collectionRef = firestore.collection("ingredients");

  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const chunk = data.slice(i, i + BATCH_SIZE);
    const batch = firestore.batch();

    chunk.forEach((item) => {
      // L'id numérique du JSON devient l'id du document (ex: "1", "2", ...)
      // pour que l'app puisse retrouver un ingrédient par son id.
      const docRef = collectionRef.doc(String(item.id));
      batch.set(docRef, item);
    });

    await batch.commit();
    console.log(`Batch ${i / BATCH_SIZE + 1} : ${chunk.length} document(s) importé(s)`);
  }

  console.log(`Data imported successfully! (${data.length} ingrédients)`);
};

importData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Erreur lors de l'import :", error);
    process.exit(1);
  });
