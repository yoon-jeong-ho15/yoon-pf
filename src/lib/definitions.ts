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
  id: string;
  name: string;
  slug: string;
  parent_id: string;
  level: string;
  children?: Category[];
};
export type Board = {
  id: string;
  created_at: string;
  writer: string;
  title: string;
  content: string;
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
