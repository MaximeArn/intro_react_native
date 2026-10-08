import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import FormInput from "@/components/form-input";
import LocationPicker, {
  type LocationValue,
} from "@/components/location-picker";
import PhotoPickerField from "@/components/photo-picker-field";
import PrimaryButton from "@/components/primary-button";
import VisibilityToggle from "@/components/visibility-toggle";
import { colors, radius, spacing, typography } from "@/constants/theme";
import type { Coordinates } from "@/hooks/use-user-location";
import { createAddress } from "@/services/addresses";
import { getErrorMessage } from "@/utils/error-messages";

const NAME_MAX_LENGTH = 80;
const DESCRIPTION_MAX_LENGTH = 500;

// Position transmise par un appui long sur la carte d'accueil
const parseCoordinates = (params: {
  latitude?: string;
  longitude?: string;
}): Coordinates | null => {
  const latitude = Number(params.latitude);
  const longitude = Number(params.longitude);
  if (!params.latitude || !params.longitude) return null;
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
  return { latitude, longitude };
};

export default function NewAddress() {
  const params = useLocalSearchParams<{
    latitude?: string;
    longitude?: string;
  }>();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [location, setLocation] = useState<LocationValue>(() => ({
    coordinates: parseCoordinates(params),
  }));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!name.trim()) return "Donne un nom à ton adresse.";
    if (!location.coordinates) return "Place l’adresse sur la carte.";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    setError(validationError);
    if (validationError || !location.coordinates) return;

    setIsSubmitting(true);
    try {
      await createAddress({
        name: name.trim(),
        description: description.trim(),
        isPublic,
        location: location.coordinates,
        formattedAddress: location.formattedAddress ?? null,
        localPhotoUri: photoUri,
      });
      router.back();
    } catch (e) {
      setError(getErrorMessage(e, "L’adresse n’a pas pu être enregistrée."));
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          // Pas de fermeture par glissement pendant l'envoi
          gestureEnabled: !isSubmitting,
          headerLeft: () => (
            <Pressable
              testID="new-address-cancel"
              disabled={isSubmitting}
              onPress={() => router.back()}
              hitSlop={8}
            >
              <Text style={styles.cancel}>Annuler</Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <PhotoPickerField
          testID="new-address-photo"
          uri={photoUri}
          onChange={setPhotoUri}
          disabled={isSubmitting}
        />

        <View style={styles.section}>
          <Text style={styles.label}>Nom</Text>
          <FormInput
            testID="new-address-name"
            value={name}
            onChangeText={setName}
            placeholder="Ex : La boulangerie du coin"
            maxLength={NAME_MAX_LENGTH}
            autoCapitalize="sentences"
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.counter}>
              {description.length}/{DESCRIPTION_MAX_LENGTH}
            </Text>
          </View>
          <FormInput
            testID="new-address-description"
            value={description}
            onChangeText={setDescription}
            placeholder="Ce que tu aimes ici, ce qu’il faut essayer…"
            maxLength={DESCRIPTION_MAX_LENGTH}
            autoCapitalize="sentences"
            autoCorrect
            multiline
            editable={!isSubmitting}
            style={styles.textarea}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Visibilité</Text>
          <VisibilityToggle
            isPublic={isPublic}
            onChange={setIsPublic}
            disabled={isSubmitting}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Emplacement</Text>
          <LocationPicker
            value={location}
            onChange={setLocation}
            disabled={isSubmitting}
          />
        </View>

        {error && (
          <Text testID="new-address-error" style={styles.error}>
            {error}
          </Text>
        )}

        <PrimaryButton
          testID="new-address-submit"
          label="Enregistrer l’adresse"
          loading={isSubmitting}
          onPress={handleSubmit}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  cancel: {
    fontSize: 17,
    color: colors.primary,
  },
  section: {
    gap: spacing.sm,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  label: {
    ...typography.overline,
  },
  counter: {
    ...typography.caption,
  },
  textarea: {
    height: 120,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  error: {
    ...typography.caption,
    fontSize: 14,
    padding: spacing.sm,
    borderRadius: radius.md,
    overflow: "hidden",
    color: colors.accent,
    backgroundColor: colors.accentSoft,
  },
});
