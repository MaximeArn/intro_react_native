import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import FormInput from "@/components/form-input";
import PhotoPickerField from "@/components/photo-picker-field";
import PrimaryButton from "@/components/primary-button";
import RatingStars from "@/components/rating-stars";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { createComment } from "@/services/comments";
import useAddressesStore from "@/stores/addresses.store";
import { getErrorMessage } from "@/utils/error-messages";

const TEXT_MAX_LENGTH = 1000;
const RATING_LABELS = [
  "",
  "Décevant",
  "Moyen",
  "Bien",
  "Très bien",
  "Excellent",
];

export default function NewReview() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const addressName = useAddressesStore(
    (state) => state.addresses.find((item) => item.id === id)?.name,
  );
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!rating) return "Choisis une note.";
    if (!text.trim()) return "Écris quelques mots sur cette adresse.";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    setError(validationError);
    if (validationError) return;

    setIsSubmitting(true);
    try {
      await createComment(id, {
        rating,
        text: text.trim(),
        localPhotoUri: photoUri,
      });
      router.back();
    } catch (e) {
      setError(getErrorMessage(e, "Ton avis n’a pas pu être publié."));
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          gestureEnabled: !isSubmitting,
          headerLeft: () => (
            <Pressable
              testID="review-cancel"
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
        {addressName && <Text style={styles.addressName}>{addressName}</Text>}

        <View style={styles.ratingBlock}>
          <RatingStars
            value={rating}
            size={40}
            onChange={setRating}
            disabled={isSubmitting}
          />
          <Text style={styles.ratingLabel}>
            {rating ? RATING_LABELS[rating] : "Touche une étoile pour noter"}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Ton avis</Text>
            <Text style={styles.counter}>
              {text.length}/{TEXT_MAX_LENGTH}
            </Text>
          </View>
          <FormInput
            testID="review-text"
            value={text}
            onChangeText={setText}
            placeholder="Qu’as-tu pensé de cet endroit ?"
            maxLength={TEXT_MAX_LENGTH}
            autoCapitalize="sentences"
            autoCorrect
            multiline
            editable={!isSubmitting}
            style={styles.textarea}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Photo (facultative)</Text>
          <PhotoPickerField
            testID="review-photo"
            uri={photoUri}
            onChange={setPhotoUri}
            disabled={isSubmitting}
          />
        </View>

        {error && (
          <Text testID="review-error" style={styles.error}>
            {error}
          </Text>
        )}

        <PrimaryButton
          testID="review-submit"
          label="Publier mon avis"
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
  addressName: {
    ...typography.heading,
    textAlign: "center",
  },
  ratingBlock: {
    alignItems: "center",
    gap: spacing.sm,
  },
  ratingLabel: {
    ...typography.body,
    fontWeight: "600",
    color: colors.textMuted,
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
    height: 140,
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
