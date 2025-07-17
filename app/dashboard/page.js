import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Redirect unauthenticated users
    return <p>Access Denied</p>;
  }

  // Example: check role
  if (session.user.role !== 'doctor') {
    return <p>Unauthorized: Doctors only</p>;
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Role: {session.user.role}</p>
    </div>
  );
}
