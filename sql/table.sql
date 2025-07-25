CREATE TABLE public."user" (
id uuid DEFAULT gen_random_uuid() NOT NULL,
created_at timestamptz DEFAULT now() NOT NULL,
username text NOT NULL,
"password" int4 NULL,
"from" int4 NULL,
profile_pic text NULL,
friend_group int4 NULL,
CONSTRAINT member_username_key UNIQUE (username),
CONSTRAINT user_pkey PRIMARY KEY (id)
);

CREATE TABLE public.chatroom (
id int8 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL,
title text DEFAULT ''::text NULL,
created_at timestamptz DEFAULT now() NULL,
CONSTRAINT chatroom_pkey PRIMARY KEY (id)
);

CREATE TABLE public.chatroom_member (
chatroom_id int8 NULL,
user_id uuid NULL,
CONSTRAINT fk_chatroom_id FOREIGN KEY (chatroom_id) REFERENCES public.chatroom(id) ON DELETE CASCADE,
CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE
);

CREATE TABLE public.chat_message (
id int8 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL,
created_at timestamptz DEFAULT now() NOT NULL,
chatroom int8 NULL,
user_id uuid NULL,
message text NULL,
CONSTRAINT chat_message_pkey PRIMARY KEY (id),
CONSTRAINT chat_message_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id)
);

create table public.chat_read_status (
id bigint generated by default as identity not null,
message_id bigint not null,
user_id uuid not null,
read_at timestamp with time zone null,
constraint chat_read_status_pkey primary key (id),
constraint unique_message_user unique (message_id, user_id),
constraint fk_message_id foreign KEY (message_id) references chat_message (id) on delete CASCADE,
constraint fk_user_id foreign KEY (user_id) references "user" (id) on delete CASCADE
);

CREATE TABLE public.notification (
id int8 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL,
user_id uuid NOT NULL,
"type" public."notification_type" NOT NULL,
"data" jsonb NULL,
read_at timestamptz NULL,
created_at timestamptz DEFAULT now() NOT NULL,
CONSTRAINT notification_pkey PRIMARY KEY (id),
CONSTRAINT notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id)
);

CREATE TABLE public.blog (
	id int8 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	title text NULL,
	"content" jsonb NULL,
	category_id int2 NULL,
	updated_at timestamptz DEFAULT now() NULL,
	status bool DEFAULT true NOT NULL,
	CONSTRAINT blog_pkey PRIMARY KEY (id),
	CONSTRAINT blog_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.blog_category(id)
);

CREATE TABLE public.blog_category (
	id int2 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 32767 START 1 CACHE 1 NO CYCLE) NOT NULL,
	"name" text NOT NULL,
	slug text NOT NULL,
	parent_id int2 NULL,
	"level" int2 NOT NULL,
	CONSTRAINT blog_category_pkey PRIMARY KEY (id)
);

CREATE OR REPLACE VIEW public.v_chatroom
AS SELECT cm.chatroom_id,
    c.title,
    u.username,
    u.id AS user_id,
    u.profile_pic
   FROM chatroom_member cm
     JOIN chatroom c ON c.id = cm.chatroom_id
     JOIN "user" u ON cm.user_id = u.id

CREATE OR REPLACE VIEW public.v_chat_message
AS SELECT msg.chatroom AS chatroom_id,
msg.id,
u.username,
u.id AS user_id,
msg.message,
u.profile_pic,
msg.created_at,
( SELECT count(\*) AS count
FROM chat_read_status crs
WHERE crs.message_id = msg.id AND crs.read_at IS NULL) AS un_read
FROM chat_message msg
JOIN "user" u ON msg.user_id = u.id;