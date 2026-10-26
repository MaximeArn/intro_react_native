import { useEffect, useState } from "react";

import { subscribeToComments } from "@/services/comments";
import type { Comment } from "@/types/comment";
import { getErrorMessage } from "@/utils/error-messages";

export function useComments(addressId: string, enabled: boolean) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    return subscribeToComments(
      addressId,
      (next) => {
        setComments(next);
        setIsLoading(false);
        setError(null);
      },
      (e) => {
        setIsLoading(false);
        setError(getErrorMessage(e, "Impossible de charger les avis."));
      },
    );
  }, [addressId, enabled]);

  const averageRating = comments.length
    ? comments.reduce((sum, comment) => sum + comment.rating, 0) /
      comments.length
    : null;

  return { comments, isLoading, error, averageRating };
}
