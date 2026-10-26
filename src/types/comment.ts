export type Comment = {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string | null;
  rating: number;
  text: string;
  photoURL: string | null;
  createdAt: Date | null;
};

export type NewComment = Pick<Comment, "rating" | "text"> & {
  localPhotoUri: string | null;
};
