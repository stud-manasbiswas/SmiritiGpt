import { LogOut, MessageSquare, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ user }) {
  const { logout } = useAuth();

  return (
    <nav className="glass-card border-b border-dark-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-glow">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text flex items-center gap-2">
                SmiritiGpt
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </h1>
              <p className="text-xs text-gray-500">Powered by Groq & LangChain</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Welcome back,</p>
              <p className="text-sm font-medium text-gray-200">{user?.name}</p>
            </div>
            <button
              onClick={logout}
              className="glass-button px-4 py-2 rounded-xl flex items-center gap-2 text-gray-300 
                         hover:text-red-400 transition-colors group"
            >
              <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}