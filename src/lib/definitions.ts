export type AuthUser = {
  id: string;
  username: string;
  password: string;
  from: string;
  profile_pic: string;
  friend_group: string;
};

export type User = {
  id: string;
  username: string;
  from: number;
  profilePic: string;
  friendGroup: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  parent_id: string;
  level: number;
  children?: Category[];
};

export type Blog = {
  id: string;
  created_at: string;
  title: string;
  content: string;
  category_id: number;
  updated_at: string;
  status: boolean;
};

export type BlogData = {
  title: string;
  content: string;
  length: number;
  category_id: number;
};

export type ChatroomUser = {
  username: string;
  id: string;
  profilePic: string;
};

export type Chatroom = {
  id: string;
  title: string;
  users: ChatroomUser[];
};

export type ChatroomMap = Map<string, Chatroom>;

export type ChatMessage = {
  id: string;
  created_at: string;
  username: string;
  user_id: string;
  message: string;
  chatroom: string;
  profile_pic: string;
};

export type ChatMessageWithReadStatus = ChatMessage & {
  unread_count: number;
  total_recipients: number;
};
