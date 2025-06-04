import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome to the Dashboard 🎉</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
