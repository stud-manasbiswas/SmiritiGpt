import { useEffect, useRef } from 'react';
import { User, Bot, Loader, Sparkles } from 'lucide-react';

export default function MessageList({ messages, loading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full 
                          flex items-center justify-center animate-pulse shadow-glow">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-20 h-20 mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full 
                          flex items-center justify-center shadow-glow animate-float">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold gradient-text mb-2 flex items-center gap-2">
            Start a Conversation <Sparkles className="w-5 h-5 text-yellow-400" />
          </h3>
          <p className="text-gray-400 max-w-md">
            Ask me anything! I can help with coding, writing, analysis, and more.
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'} 
                         animate-in slide-in-from-bottom duration-300`}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 
                                flex items-center justify-center flex-shrink-0 shadow-glow">
                  <Bot size={20} className="text-white" />
                </div>
              )}
              
              <div className={`max-w-2xl ${message.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`px-5 py-3 rounded-2xl backdrop-blur-xl
                    ${message.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow'
                      : 'glass-card text-gray-100'
                    }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
                <p className="text-xs text-gray-600 mt-2 px-2">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-glass-medium border border-dark-border
                                flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-gray-400" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}