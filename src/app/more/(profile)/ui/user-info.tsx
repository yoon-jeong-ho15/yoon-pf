export default function UserInfo({ user }: { user: any }) {
  return (
    <div>
      <h1>{Object.keys(user)}</h1>
    </div>
  );
}
