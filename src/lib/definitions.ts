import { Delta } from "quill";

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
  parent_id: number;
  level: number;
  children?: Category[];
};

export type CategoryWithDetail = {
  id: number;
  name: string;
  parent_id: number;
  level: number;
  description: string;
  blog?: [
    {
      blog_id?: number;
      blog_title?: string;
      blog_keyword?: string[];
    }
  ];
  children?: Category[];
};

export type Blog = {
  id: number;
  created_at: string;
  title: string;
  content: Delta;
  category_id: number;
  updated_at: string;
  status: boolean;
  length: number;
};

export type BlogInsertData = {
  title: string;
  content: string;
  length: number;
  category_id: number;
};

export type BlogUpdateData = {
  id: number;
  title: string;
  content: string;
  length: number;
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
