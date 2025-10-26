import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { conversationAPI } from '../../services/api';
import MessageList from './MessageList';
import { MessageSquare } from 'lucide-react';

export default function SharedConversation() {
  const { token } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSharedConversation();
  }, [token]);

  const loadSharedConversation = async () => {
    try {
      const { data } = await conversationAPI.getShared(token);
      setConversation(data.conversation);
      setMessages(data.messages);
    } catch (err) {
      setError('Conversation not found or not shared');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <MessageSquare className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-850 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <MessageSquare className="w-8 h-8 text-indigo-400" />
          <div>
            <h1 className="text-2xl font-bold text-white truncate">
              {conversation?.title || 'Untitled Conversation'}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Shared by {conversation?.userId?.name || 'Unknown'}
            </p>
          </div>
        </div>
      </nav>

      {/* Messages */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] p-2">
        <MessageList messages={messages} loading={false} />
      </div>
    </div>
  );
}
