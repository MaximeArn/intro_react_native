import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CommentCard from "@/components/comment-card";
import RatingStars from "@/components/rating-stars";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useComments } from "@/hooks/use-comments";
import { deleteComment } from "@/services/comments";
import type { Comment } from "@/types/comment";
import { getErrorMessage } from "@/utils/error-messages";

type Props = {
  addressId: string;
  userId: string | undefined;
};

const formatAverage = (value: number) =>
  value.toLocaleString("fr-FR", { maximumFractionDigits: 1 });

export default function ReviewsSection({ addressId, userId }: Props) {
  const { comments, isLoading, error, averageRating } = useComments(
    addressId,
    true,
  );

  const confirmDelete = (comment: Comment) =>
    Alert.alert("Supprimer ton avis ?", "Cette action est définitive.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () =>
          deleteComment(addressId, comment).catch((e) =>
            Alert.alert(
              "Suppression impossible",
              getErrorMessage(e, "Ton avis n’a pas pu être supprimé."),
            ),
          ),
      },
    ]);

  return (
    <View testID="reviews-section" style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Avis</Text>
        {averageRating !== null && (
          <View style={styles.summary}>
            <RatingStars value={averageRating} size={16} />
            <Text style={styles.summaryText}>
              {formatAverage(averageRating)} · {comments.length} avis
            </Text>
          </View>
        )}
      </View>

      <Pressable
        testID="add-review-button"
        onPress={() =>
          router.push({
            pathname: "/addresses/[id]/review",
            params: { id: addressId },
          })
        }
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
      >
        <MaterialCommunityIcons
          name="star-plus-outline"
          size={20}
          color={colors.primary}
        />
        <Text style={styles.addButtonText}>Donner mon avis</Text>
      </Pressable>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : comments.length === 0 ? (
        <Text style={styles.empty}>
          Aucun avis pour l’instant. Sois le premier à donner le tien !
        </Text>
      ) : (
        comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            isMine={comment.authorId === userId}
            onDelete={() => confirmDelete(comment)}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    ...typography.overline,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  summaryText: {
    ...typography.caption,
    fontWeight: "700",
    color: colors.text,
  },
  addButton: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: "dashed",
    backgroundColor: colors.primarySoft,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
  empty: {
    ...typography.body,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: spacing.sm,
    color: colors.textMuted,
  },
  error: {
    ...typography.body,
    color: colors.accent,
  },
});
