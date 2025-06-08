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
  profilePic: string;
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
};

export type ChatroomMap = Map<Chatroom, ChatroomUser[]>;

export type ChatMessage = {
  id: string;
  created_at: string;
  username: string;
  message: string;
  chatroom: string;
  profile_pic: string;
};
