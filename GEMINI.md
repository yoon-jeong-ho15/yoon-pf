# Project Summary: yoon-pf

This project is a Next.js application that utilizes Supabase for its backend, including authentication and real-time features.

## Key Technologies:

- **Next.js**
- **Supabase**: PostgreSQL Database, Real-time(WebSocket).
- **NextAuth.js**
- **Tailwind CSS**
- **Motion**: Animation library.
- **Quill.js**: Rich text editors.

## Project Structure:

- `src/app`: Contains Next.js pages and API routes.

  - `src/app/more/chat`: Contains components related to the chat functionality, including `chat-list.tsx`, `message-box.tsx`, and `chatroom-provider.tsx`.
  - `src/lib`: Contains utility functions, data fetching logic, and Supabase client initialization.
    - `src/lib/supabase.ts`: Initializes the Supabase client.
    - `src/lib/data.ts`: Handles data fetching and manipulation using Supabase.
    - `src/lib/action.ts`: Server actions.
    - `src/lib/definitions.ts`: Defines data structures (e.g., `Chatroom`, `User`, `ChatMessage`).
  - `src/auth.ts`: Configures NextAuth.js for authentication.
  - `sql`: Contains PostgreSQL DDLs(Tables(Views), Functions).

## Core Functionality:

- **Authentication**: Users can sign in using credentials.
- **Chat**: Real-time chat functionality using Supabase Realtime.
  - Users can view chat lists, send messages, and manage chatrooms.
- **Data Management**: Interacts with a Supabase PostgreSQL database for various data operations (e.g., fetching boards, users, chat messages).
