import { Plus, Trash2, MessageSquare, Share2, Sparkles } from 'lucide-react';
import { conversationAPI } from '../../services/api';
import { useState } from 'react';

export default function ConversationSidebar({
  conversations,
  currentConversation,
  onSelect,
  onNew,
  onDelete
}) {
  const [shareUrl, setShareUrl] = useState('');

  const handleShare = async (conversationId, e) => {
    e.stopPropagation();
    try {
      const { data } = await conversationAPI.share(conversationId);
      setShareUrl(data.shareUrl);
      navigator.clipboard.writeText(data.shareUrl);
      alert('Share link copied to clipboard!');
    } catch (error) {
      console.error('Share error:', error);
      alert('Failed to share conversation');
    }
  };

  const handleDelete = async (conversationId, e) => {
    e.stopPropagation();
    if (confirm('Delete this conversation?')) {
      onDelete(conversationId);
    }
  };

  return (
    <div className="w-72 glass-card border-r border-dark-border flex flex-col h-full">
      <div className="p-4 border-b border-dark-border">
        <button
          onClick={onNew}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 
                     rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300
                     shadow-glow hover:shadow-glow-lg flex items-center justify-center gap-2 font-medium"
        >
          <Plus size={20} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-glass-light rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-sm text-gray-500">No conversations yet</p>
            <p className="text-xs text-gray-600 mt-1">Start chatting to begin!</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => onSelect(conv)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 mb-2 group
                ${currentConversation?._id === conv._id 
                  ? 'glass-card bg-glass-medium shadow-glow' 
                  : 'glass-button hover:bg-glass-light'
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-2">
                  <h3 className="font-medium text-gray-200 truncate text-sm flex items-center gap-2">
                    {conv.title}
                    {conv.title !== 'New Conversation' && (
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleShare(conv._id, e)}
                    className="p-1.5 rounded-lg hover:bg-glass-medium transition-colors"
                    title="Share"
                  >
                    <Share2 size={14} className="text-indigo-400" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(conv._id, e)}
                    className="p-1.5 rounded-lg hover:bg-glass-medium transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}