import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/authService";
import CtSbrChat from "../components/CtSbrChat";

const Home = () => {
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold">Home</h1>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-100"
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>
      <div className="p-8">
        <CtSbrChat />
      </div>
    </div>
  );
};

export default Home;
