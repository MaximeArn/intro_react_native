import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { CameraView, useCameraPermissions, type CameraType } from "expo-camera";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PrimaryButton from "@/components/primary-button";
import { colors, radius, spacing, typography } from "@/constants/theme";

type Props = {
  visible: boolean;
  initialFacing?: CameraType;
  onClose: () => void;
  onCapture: (uri: string) => void;
};

export default function CameraModal({
  visible,
  initialFacing = "back",
  onClose,
  onCapture,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      {/* Monté seulement quand visible : la caméra est libérée à la fermeture */}
      {visible && (
        <CameraScreen
          initialFacing={initialFacing}
          onClose={onClose}
          onCapture={onCapture}
        />
      )}
    </Modal>
  );
}

function CameraScreen({
  initialFacing,
  onClose,
  onCapture,
}: Omit<Props, "visible"> & { initialFacing: CameraType }) {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>(initialFacing);
  const [isReady, setIsReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);

  // Statut de la permission en cours de chargement
  if (!permission) {
    return <View style={styles.camera} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.permission, { paddingTop: insets.top }]}>
        <Text style={styles.permissionTitle}>Accès à l’appareil photo</Text>
        <Text style={styles.permissionText}>
          Autorise l’appareil photo pour prendre une photo.
        </Text>
        <PrimaryButton
          testID="camera-permission-button"
          label={permission.canAskAgain ? "Autoriser" : "Ouvrir les réglages"}
          onPress={() =>
            permission.canAskAgain
              ? requestPermission()
              : Linking.openSettings()
          }
        />
        <Pressable onPress={onClose} style={styles.permissionCancel}>
          <Text style={styles.permissionCancelText}>Annuler</Text>
        </Pressable>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;
    setCaptureError(null);
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      onCapture(photo.uri);
    } catch {
      setCaptureError("La photo n’a pas pu être prise, réessaie.");
      setIsCapturing(false);
    }
  };

  return (
    <View style={styles.camera}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        onCameraReady={() => setIsReady(true)}
      />
      <Pressable
        testID="camera-close"
        onPress={onClose}
        hitSlop={12}
        style={[styles.close, { top: insets.top + spacing.sm }]}
      >
        <MaterialCommunityIcons name="close" size={28} color="#FFFFFF" />
      </Pressable>

      <View
        style={[styles.controls, { paddingBottom: insets.bottom + spacing.lg }]}
      >
        {captureError && (
          <Text testID="camera-error" style={styles.captureError}>
            {captureError}
          </Text>
        )}
        {/* Espace symétrique au bouton de retournement */}
        <View style={styles.sideButton} />
        <Pressable
          testID="camera-shutter"
          disabled={!isReady || isCapturing}
          onPress={takePicture}
          style={({ pressed }) => [styles.shutter, pressed && styles.pressed]}
        >
          {isCapturing ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <View style={styles.shutterInner} />
          )}
        </Pressable>
        <Pressable
          testID="camera-flip"
          onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
          style={styles.sideButton}
        >
          <MaterialCommunityIcons
            name="camera-flip-outline"
            size={30}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    backgroundColor: "#000000",
  },
  close: {
    position: "absolute",
    left: spacing.md,
    padding: spacing.xs,
  },
  controls: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  captureError: {
    position: "absolute",
    bottom: "100%",
    left: spacing.lg,
    right: spacing.lg,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 14,
  },
  sideButton: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
  permission: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  permissionTitle: {
    ...typography.title,
    color: colors.primary,
  },
  permissionText: {
    ...typography.body,
    color: colors.textMuted,
  },
  permissionCancel: {
    alignSelf: "center",
    padding: spacing.sm,
  },
  permissionCancelText: {
    ...typography.body,
    fontWeight: "600",
    color: colors.textMuted,
  },
});
