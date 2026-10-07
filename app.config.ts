export default {
  expo: {
    name: "intro",
    slug: "intro",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "intro",
    userInterfaceStyle: "automatic",
    ios: {
      icon: "./assets/expo.icon",
      bundleIdentifier: "com.maximearnould.intro",
      // Sur EAS : fichier fourni par la variable d'environnement. En local : fichier du dossier config/
      googleServicesFile:
        process.env.GOOGLE_SERVICE_INFO_PLIST ??
        "./config/googleService/ios.plist",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ??
        "./config/googleService/android.json",
      predictiveBackGestureEnabled: false,
      package: "com.maximearnould.intro",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#FAF6EC",
          image: "./assets/images/splash-icon.png",
          imageWidth: 76,
        },
      ],
      "expo-status-bar",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      [
        "react-native-maps",
        {
          // iOS utilise Apple Maps (pas de clé). Android : clé "Maps SDK for Android"
          androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY,
        },
      ],
      [
        "expo-location",
        {
          locationWhenInUsePermission:
            "Ta position permet de centrer la carte et de localiser tes adresses.",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission:
            "L'appareil photo permet de prendre en photo tes adresses et ton profil.",
          recordAudioAndroid: false,
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "L'accès aux photos permet d'illustrer tes adresses, avis et profil.",
          cameraPermission:
            "L'appareil photo permet de prendre en photo tes adresses et ton profil.",
          microphonePermission: false,
        },
      ],
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "dynamic",
            forceStaticLinking: ["react-native-maps", "ExpoImagePicker"],
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "eb7c39a3-c4d2-4cea-a1a9-ecc45e5820b3",
      },
    },
  },
};
