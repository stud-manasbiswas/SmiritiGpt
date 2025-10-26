import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { conversationAPI } from '../../services/api';
import ConversationSidebar from './ConversationSidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Navbar from '../Shared/Navbar';
import { MessageSquare } from 'lucide-react';

export default function ChatInterface() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation._id);
    }
  }, [currentConversation]);

  const loadConversations = async () => {
    try {
      const { data } = await conversationAPI.getAll();
      setConversations(data);
      if (data.length > 0 && !currentConversation) {
        setCurrentConversation(data[0]);
      }
    } catch (error) {
      console.error('Load conversations error:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setLoading(true);
      const { data } = await conversationAPI.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Load messages error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      const { data } = await conversationAPI.create({ title: 'New Conversation' });
      setConversations([data, ...conversations]);
      setCurrentConversation(data);
      setMessages([]);
    } catch (error) {
      console.error('Create conversation error:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setCurrentConversation(conversation);
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await conversationAPI.delete(conversationId);
      const updatedConversations = conversations.filter(c => c._id !== conversationId);
      setConversations(updatedConversations);
      
      if (currentConversation?._id === conversationId) {
        setCurrentConversation(updatedConversations[0] || null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Delete conversation error:', error);
    }
  };

const handleMessageSent = async () => {
  // Reload messages
  await loadMessages(currentConversation._id);
  
  // Also reload conversations to get updated title
  await loadConversations();
  
  // Update current conversation reference
  const { data } = await conversationAPI.getAll();
  const updated = data.find(c => c._id === currentConversation._id);
  if (updated) {
    setCurrentConversation(updated);
  }
};

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Navbar */}
      <Navbar user={user} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <ConversationSidebar
          conversations={conversations}
          currentConversation={currentConversation}
          onSelect={handleSelectConversation}
          onNew={handleNewConversation}
          onDelete={handleDeleteConversation}
        />

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {currentConversation ? (
            <>
              {/* Header */}
              <div className="bg-gray-850 border-b border-gray-700 px-6 py-3">
                <h2 className="text-lg font-semibold text-white">
                  {currentConversation.title}
                </h2>
              </div>

              {/* Messages */}
              <MessageList messages={messages} loading={loading} />

              {/* Input */}
              <MessageInput
                conversationId={currentConversation._id}
                onMessageSent={handleMessageSent}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  Select a conversation or start a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
