import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import ChatWidget from "../components/ChatWidget";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>
        <Navbar />
        <ChatWidget />
      </div>
    </ProtectedRoute>
  );
}
