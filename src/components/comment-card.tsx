import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Avatar from "@/components/avatar";
import RatingStars from "@/components/rating-stars";
import { colors, radius, shadow, spacing, typography } from "@/constants/theme";
import type { Comment } from "@/types/comment";
import { formatLongDate } from "@/utils/format-date";

type Props = {
  comment: Comment;
  isMine: boolean;
  onDelete?: () => void;
};

export default function CommentCard({ comment, isMine, onDelete }: Props) {
  const date = formatLongDate(comment.createdAt);

  return (
    <View testID={`comment-${comment.id}`} style={styles.card}>
      <View style={styles.header}>
        <Avatar
          name={comment.authorName}
          uri={comment.authorPhotoURL}
          size={40}
        />
        <View style={styles.author}>
          <Text style={styles.authorName} numberOfLines={1}>
            {isMine ? "Toi" : comment.authorName}
          </Text>
          <View style={styles.meta}>
            <RatingStars value={comment.rating} size={14} />
            {date && <Text style={styles.date}>{date}</Text>}
          </View>
        </View>
        {isMine && onDelete && (
          <Pressable
            testID={`comment-delete-${comment.id}`}
            accessibilityLabel="Supprimer mon avis"
            onPress={onDelete}
            hitSlop={8}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        )}
      </View>

      <Text style={styles.text}>{comment.text}</Text>

      {comment.photoURL && (
        <Image
          source={{ uri: comment.photoURL }}
          style={styles.photo}
          contentFit="cover"
          transition={200}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  author: {
    flex: 1,
    gap: 2,
  },
  authorName: {
    ...typography.body,
    fontWeight: "700",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  date: {
    ...typography.caption,
  },
  text: {
    ...typography.body,
    lineHeight: 22,
  },
  photo: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  pressed: {
    opacity: 0.6,
  },
});
