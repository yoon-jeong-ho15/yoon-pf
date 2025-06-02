export type AuthUser = {
  id: string;
  username: string;
  password: string;
  from: string;
  profile_pic: string;
};

export type User = {
  id: string;
  username: string;
  from: number;
  pic: string;
};

export type Board = {
  id: string;
  created_at: string;
  writer: string;
  title: string;
  content: string;
};

export type Chatroom = {
  id: string;
  user1: string;
  user2: string;
};

export type ChatMessage = {
  id: string;
  created_at: string;
  sent: string;
  message: string;
  chatroom: string;
};
