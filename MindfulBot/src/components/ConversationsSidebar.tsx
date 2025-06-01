import React from 'react';
import { StoredConversation } from '../utils/conversationStorage';
import { Plus, Trash2 } from 'lucide-react';

interface ConversationsSidebarProps {
  conversations: StoredConversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewConversation: () => void;
  isLoading: boolean;
}

const ConversationsSidebar: React.FC<ConversationsSidebarProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
  isLoading
}) => {
  return (
    <div className="w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 p-4 flex flex-col">
      <button
        className="flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-lg bg-starry-highlight/20 text-starry-highlight hover:bg-starry-highlight/30 transition-colors mb-4"
        onClick={onNewConversation}
      >
        <Plus className="w-5 h-5" />
        <span>New Chat</span>
      </button>

      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-starry-highlight"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-starry-muted py-4">
            No conversations yet
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                  conversation.id === currentConversationId
                    ? 'bg-starry-highlight/20 text-starry-highlight'
                    : 'hover:bg-white/5 text-starry-text'
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="pr-8">
                  <div className="font-medium truncate">{conversation.title}</div>
                  <div className="text-sm text-starry-muted">
                    {new Date(conversation.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-starry-muted hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsSidebar; 