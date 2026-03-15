export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  is_approved: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile | null;
  likes_count?: number;
  comments_count?: number;
  liked_by_me?: boolean;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles?: Profile | null;
};

export type Event = {
  id: string;
  user_id: string;
  title: string;
  event_date: string;
  memo: string | null;
  created_at: string;
};

export type Album = {
  id: string;
  year: number;
  title: string | null;
  created_at: string;
  photos_count?: number;
};

export type Photo = {
  id: string;
  album_id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
};
