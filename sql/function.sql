CREATE OR REPLACE FUNCTION public.get_chatroom_data(p_username text)
RETURNS TABLE(id integer, title text, username text, uid uuid, profile_pic text)
LANGUAGE sql
SET search_path TO 'public'
AS $function$
SELECT \*
FROM v_chatroom vch
WHERE vch.username != p_username
AND EXISTS (
SELECT vch2.chatroom_id
FROM v_chatroom vch2
WHERE vch2.username = p_username
AND vch.chatroom_id = vch2.chatroom_id
);
$function$
;

CREATE OR REPLACE FUNCTION public.get_dm_chatroom(userid uuid[], member_count integer)
 RETURNS TABLE(chatroom_id bigint)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    RETURN QUERY
    SELECT cm.chatroom_id
    FROM public.chatroom_member cm
    WHERE cm.user_id = ANY(userid)
    GROUP BY cm.chatroom_id
    HAVING COUNT(*) = member_count
        AND COUNT(DISTINCT cm.user_id) = array_length(userid, 1)
        AND array_length(userid, 1) = member_count;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_group_chatroom(userid uuid[], member_count integer, p_title text)
 RETURNS TABLE(chatroom_id bigint)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    RETURN QUERY
    SELECT cm.chatroom_id
    FROM public.chatroom_member cm
	join public.chatroom c on (cm.chatroom_id = c.id)
    WHERE cm.user_id = ANY(userid)
    GROUP BY cm.chatroom_id, c.title
    HAVING COUNT(*) = member_count
        AND COUNT(DISTINCT cm.user_id) = array_length(userid, 1)
        AND array_length(userid, 1) = member_count
		and c.title = p_title;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_chat_message()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  sender_username TEXT;
  message_preview TEXT;
BEGIN
  SELECT username INTO sender_username
  FROM "user"
  WHERE id = NEW.user_id;

  message_preview := CASE
    WHEN LENGTH(NEW.message) > 20
    THEN LEFT(NEW.message, 20) || '...'
    ELSE NEW.message
  END;

  INSERT INTO chat_read_status (message_id, user_id, read_at)
  SELECT
    NEW.id as message_id,
    cm.user_id,
    CASE
      WHEN cm.user_id = NEW.user_id THEN NOW()
      ELSE NULL
    END as read_at
  FROM chatroom_member cm
  WHERE cm.chatroom_id = NEW.chatroom;

  INSERT INTO notification (user_id, type, data)
  SELECT
    cm.user_id,
    'chat_message'::notification_type,
    jsonb_build_object(
      'chatroom_id', NEW.chatroom,
      'message_id', NEW.id,
      'sender_username', sender_username,
      'message_preview', message_preview,
      'created_at', NEW.created_at
    )
  FROM chatroom_member cm
  WHERE cm.chatroom_id = NEW.chatroom
  AND cm.user_id != NEW.user_id;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.mark_chatroom_as_read(p_chatroom_id bigint, p_user_id uuid)
 RETURNS TABLE(messages_read integer, notifications_read integer)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  msg_count INTEGER;
  notif_count INTEGER;
BEGIN
  UPDATE chat_read_status
  SET read_at = NOW()
  WHERE user_id = p_user_id
  AND read_at IS NULL
  AND message_id IN (
    SELECT id FROM chat_message
    WHERE chatroom = p_chatroom_id
    AND user_id != p_user_id
  );

  GET DIAGNOSTICS msg_count = ROW_COUNT;

  UPDATE notification
  SET read_at = NOW()
  WHERE user_id = p_user_id
  AND type = 'chat_message'
  AND read_at IS NULL
  AND (data->>'chatroom_id')::BIGINT = p_chatroom_id;

  GET DIAGNOSTICS notif_count = ROW_COUNT;

  RETURN QUERY SELECT msg_count, notif_count;
END;
$function$
;