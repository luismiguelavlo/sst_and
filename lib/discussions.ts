export type DiscussionAuthor = {
  id: string;
  name: string;
  jobTitle: string;
  initials: string;
  photoUrl: string | null;
  role: "admin" | "user";
};

export type DiscussionReply = {
  id: string;
  body: string;
  createdAt: string;
  author: DiscussionAuthor;
  canDelete: boolean;
};

export type DiscussionThread = {
  id: string;
  body: string;
  createdAt: string;
  author: DiscussionAuthor;
  canDelete: boolean;
  replies: readonly DiscussionReply[];
};
