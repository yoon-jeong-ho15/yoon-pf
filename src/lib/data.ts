import { Board, ChatMessage, ChatroomMap, User } from "./definitions";
import { supabase } from "./supabase";

export async function fetchBoards(query: string, currentPage: number) {
  const offset = (currentPage - 1) * 25;
  const { data, error } = await supabase
    .from("board")
    .select("*")
    .or(`title.ilike.%${query},writer.ilike.%${query}%`)
    .eq("status", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + 24);
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    return data;
  }
}

export async function fetchBoardById(id: string) {
  const { data, error } = await supabase.from("board").select("*").eq("id", id);

  if (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch the board");
  } else {
    return data[0] as Board;
  }
}

export async function fetchChatrooms(username: string) {
  const { data, error } = await supabase.rpc("get_chatroom_data", {
    p_username: username,
  });
  const chatrooms: ChatroomMap = new Map();

  if (error) {
    console.error("Error fetching data : ", error);
    throw new Error("Failed to fetch Chatrooms");
  }

  if (!data) {
    console.log("No chatroom data returned from get_chatroom_data.");
    return chatrooms; // 빈 Map 반환
  }

  data.forEach((obj: Record<string, unknown>) => {
    const roomId = String(obj.id);
    const roomtitle = obj.title as string;
    const username = obj.username as string;
    const uid = obj.uid as string;
    const profilePic = obj.profile_pic as string;

    let room = chatrooms.get(roomId);

    if (!room) {
      room = {
        id: roomId,
        title: roomtitle,
        users: [],
      };
      chatrooms.set(roomId, room);
    }

    room.users.push({
      username: username,
      id: uid,
      profilePic: profilePic,
    });
  });

  return chatrooms;
}

export async function fetchUserByUsername(username: string) {
  // console.log("fetchUserByUsername username : ", username);
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("username", username);
  if (error) {
    console.error("Error fetching data", error);
    throw new Error("Failed to fetch user by username");
  } else {
    const user: User = {
      id: data[0].id,
      username: data[0].username,
      from: data[0].from,
      profilePic: data[0].profile_pic,
      friendGroup: data[0].friend_group,
    };
    return user;
  }
}

export async function fetchChatsByChatroomId(chatroomId: string) {
  console.log("fetchChatsByChatroomId id : ", chatroomId);
  const { data, error } = await supabase
    .from("v_chat_message")
    .select("*")
    .eq("chatroom_id", chatroomId)
    .order("id");

  if (error) {
    console.error("Error fetching Chats", error);
    throw new Error("Failed to fetch Chats by chatroom id");
  } else {
    return data as ChatMessage[];
  }
}

export async function insertChat(formData: FormData) {
  // console.log("insertchat() formData : ", formData);
  const { data, error } = await supabase
    .from("chat_message")
    .insert({
      chatroom: formData.get("chatroom"),
      user_id: formData.get("user_id"),
      message: formData.get("message"),
    })
    .select("id");

  if (error) {
    console.error("Error inserting chat message", error);
  } else {
    return data[0].id;
  }
}

export async function fetchChatById(id: string) {
  const { data, error } = await supabase
    .from("v_chat_message")
    .select("*")
    .eq("id", id);

  if (error) {
    console.error("Error fetching chat message", error);
  } else {
    return data[0] as ChatMessage;
  }
}

export async function fetchUsersByGroup(group: string, username: string) {
  console.log("username : ", username, "group : ", group);
  console.log(typeof group);
  let query = supabase
    .from("user")
    .select()
    .or(`friend_group.eq.${group}, friend_group.eq.0`)
    .neq("username", username);

  if (group + "" === "0") {
    query = supabase.from("user").select().neq("username", username);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching users by group", error);
  } else {
    return data as User[];
  }
}

export async function checkExistingChatroom(
  selectedFriend: string[],
  title?: string
) {
  const { data } = await supabase.rpc("check_chatroom", {
    userid: selectedFriend,
    member_count: selectedFriend.length,
    p_title: title ? title : "",
  });
  console.log("data", data);
  if (data) {
    return data;
  }
}

export async function insertChatroom(title?: string) {
  const { data, error } = await supabase
    .from("chatroom")
    .insert({ title: title })
    .select("id")
    .single();
  if (error) {
    console.error("Error inserting chatroom", error);
  } else {
    return data.id as string;
  }
}

export async function insertChatroomMember(
  insertingData: {
    chatroom_id: string;
    user_id: string;
  }[]
) {
  const { error } = await supabase
    .from("chatroom_member")
    .insert(insertingData);

  if (error) {
    console.error("Error inserting chatroom members", error);
  }
}

export async function fetchChatsWithReadStatus(chatroomId: string) {
  const { data, error } = await supabase.rpc(
    "get_chat_messages_with_read_status",
    {
      p_chatroom_id: chatroomId,
    }
  );

  if (error) {
    console.error(
      "Error fetching chats with read status:",
      JSON.stringify(error, null, 2)
    );
    return null;
  }

  return data;
}

export async function enterChatroom(chatroomId: string, userId: string) {
  const { error } = await supabase.rpc("mark_chatroom_as_read", {
    p_chatroom_id: chatroomId,
    p_user_id: userId,
  });

  if (error) {
    console.error("Error marking messages as read", error);
  }
}

export async function markMessageAsRead(messageId: string, userId: string) {
  const { error } = await supabase.rpc("mark_single_message_as_read", {
    p_message_id: messageId,
    p_user_id: userId,
  });

  if (error) {
    console.error("Error marking message as read", error);
  }
}
