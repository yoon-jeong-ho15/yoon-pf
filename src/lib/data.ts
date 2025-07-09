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
  // console.log("fetchChatrooms username : ", username);
  const { data, error } = await supabase.rpc("get_chatroom_data", {
    p_username: username,
  });
  const chatrooms: ChatroomMap = new Map();
  data.map((obj: Record<string, unknown>) => {
    // console.log("obj", obj);

    const roomId = obj.id as string;
    const roomtitle = obj.title as string;

    //채팅방
    let room = null;
    for (const [existingRoom] of chatrooms) {
      if (existingRoom.id === roomId) {
        room = existingRoom;
        break;
      }
    }

    if (!room) {
      room = {
        id: roomId,
        title: roomtitle,
      };
    }

    //유저
    const user = {
      username: obj.username as string,
      id: obj.uid as string,
      profilePic: obj.profile_pic as string,
    };

    if (chatrooms.has(room)) {
      chatrooms.get(room)?.push(user);
    } else {
      chatrooms.set(room, [user]);
    }
  });

  // console.log(chatrooms);
  if (error) {
    console.error("Error fetching data : ", error);
    throw new Error("Failed to fetch Chatrooms");
  } else {
    return chatrooms;
  }
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

export async function fetchChatsByChatroomId(id: string) {
  // console.log("fetchChatsByChatroomId id : ", id);
  const { data, error } = await supabase
    .from("v_chat_message")
    .select("*")
    .eq("chatroom", id);

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
  let query = supabase
    .from("user")
    .select()
    .or(`friend_group.eq.${group}, friend_group.eq.0`)
    .neq("username", username);

  if (group === "0") {
    query = supabase.from("user").select().neq("username", username);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching users by group", error);
  } else {
    return data as User[];
  }
}

export async function checkExistingDM(selectedFriend: string[]) {
  console.log("fetchChatroomByUserId");
  // console.log(selectedFriend);
  // console.log(selectedFriend.length);
  const { data } = await supabase.rpc("get_dm_chatroom", {
    userid: selectedFriend,
    member_count: selectedFriend.length,
  });
  if (data.length !== 0) {
    return data[0].chatroom_id;
  }
  return null;
}

export async function checkExistingGroupChat(
  selectedFriend: string[],
  title?: string
) {
  // console.log(`checkExistingGroupChat. title:${title}`);
  const { data } = await supabase.rpc("get_group_chatroom", {
    userid: selectedFriend,
    member_count: selectedFriend.length,
    p_title: title,
  });
  if (data.length !== 0) {
    return data[0].chatroom_id;
  }
  return null;
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

// export async function insertNotification(newMessage: ChatMessage) {
//   const { data, error } = await supabase.from("notification").insert({
//     type: "chat_message",
//   });
// }
