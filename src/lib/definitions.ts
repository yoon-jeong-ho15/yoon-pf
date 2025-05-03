import { Delta } from "quill";

export type User = {
  id: string;
  username: string;
  password: string;
  from: number;
};

export type Board = {
  id: string;
  createdAt: string;
  writer: string;
  title: string;
  content: Delta;
};
