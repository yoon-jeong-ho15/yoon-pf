export type User = {
  id: string;
  username: string;
  password: string;
  from: number;
};

export type Board = {
  id: string;
  created_at: string;
  writer: string;
  title: string;
  content: string;
};
