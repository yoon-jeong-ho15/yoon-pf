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

export type Blog = {
  id: string;
  title: string;
  date: string;
  tags: string[];
  path?: string[]; // Category path derived from folder structure
  slug?: string; // Custom slug from frontmatter
  index?: number; // numerical order of the blog posts
  instructor?: string;
  author?: string;
  provide?: string;
  publish?: string;
  link?: string;
};

export type BlogData = {
  blog: Blog;
  contentHTML: string;
};

export type Category = {
  path: string[];
  name: string;
  children: Category[];
  blogs: Blog[];
};

export type CategoryMap = { [key: string]: Category };

// export type Category = {
//   id: number;
//   name: string;
//   slug: string;
//   parent_id: number;
//   level: number;
//   children?: Category[];
// };

// export type CategoryWithDetail = {
//   id: number;
//   name: string;
//   parent_id: number;
//   level: number;
//   count: number;
//   sum: number;
//   description: string;
//   blogs?: [
//     {
//       id?: number;
//       title?: string;
//       keyword?: string[];
//     }
//   ];
//   children?: CategoryWithDetail[];
// };
//
// export type CategoryWithDetailMap = Map<number, CategoryWithDetail>;
//
// export type Blog = {
//   id: number;
//   created_at: string;
//   title: string;
//   content: Delta;
//   category_id: number;
//   updated_at: string;
//   status: boolean;
//   length: number;
//   path: string[];
// };

// export type BlogInsertData = {
//   title: string;
//   content: string;
//   length: number;
//   category_id: number;
// };

// export type BlogUpdateData = {
//   id: number;
//   title: string;
//   content: string;
//   length: number;
// };

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
  recipients_count: number;
  unread_count: number;
};

export type MessageDataForNotification = {
  message_id: number;
  chatroom_title: string;
  sender_username: string;
  message_preview: string;
};

export type Notification = {
  id: number;
  user_id: string;
  type: string;
  created_at: string;
  data: MessageDataForNotification;
};
