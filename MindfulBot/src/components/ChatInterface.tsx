import React, { useState, useRef, KeyboardEvent, useEffect, useCallback } from 'react';
import { useChat } from '../utils/chatUtils';
import MessageBubble from './MessageBubble';
import ConversationsSidebar from './ConversationsSidebar';
import { Send, ChevronDown } from 'lucide-react';
import { 
  StoredConversation, 
  saveConversation, 
  loadConversation, 
  getAllConversations,
  deleteConversation,
  generateConversationId,
  initializeConversationsDirectory,
  conversationsDirectory
} from '../utils/conversationStorage';
import { useToast } from '../hooks/use-toast';
//import LandingPage from './pages/LandingPage';

const ChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [conversations, setConversations] = useState<StoredConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [partialMessage, setPartialMessage] = useState('');
  const { toast } = useToast();
  
  const { 
    messages, 
    loading, 
    sendMessage, 
    messagesEndRef, 
    availableModels, 
    currentModel, 
    setModel,
    availablePersonas,
    currentPersona,
    setPersona,
    loadMessages,
    clearMessages
  } = useChat();

  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const personaDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize conversations directory and load conversations on mount
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        setIsLoading(true);
        await initializeConversationsDirectory();
        const loadedConversations = await getAllConversations();
        setConversations(loadedConversations);
        
        if (loadedConversations.length > 0) {
          const mostRecent = loadedConversations[0];
          setCurrentConversationId(mostRecent.id);
          const conversation = await loadConversation(mostRecent.id);
          if (conversation) {
            loadMessages(conversation.messages);
          }
        }
      } catch (error) {
        console.error('Failed to initialize conversations:', error);
        toast({
          title: "Error",
          description: "Failed to load conversations. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeStorage();
  }, []);

  // Debounced save conversation
  const debouncedSave = useCallback(
    React.useMemo(
      () => {
        let timeoutId: NodeJS.Timeout;
        return (conversation: StoredConversation) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(async () => {
            try {
              await saveConversation(conversation);
              const updatedConversations = await getAllConversations();
              setConversations(updatedConversations);
            } catch (error) {
              console.error('Failed to save conversation:', error);
              toast({
                title: "Error",
                description: "Failed to save conversation. Your changes may not be persisted.",
                variant: "destructive",
              });
            }
          }, 1000);
        };
      },
      []
    ),
    []
  );

  // Save conversation when messages change
  useEffect(() => {
    if (messages.length > 0 && currentConversationId) {
      const conversation: StoredConversation = {
        id: currentConversationId,
        title: messages[0].content.slice(0, 30) + '...',
        messages: messages.map(msg => ({
          role: msg.sender,
          content: msg.content,
          timestamp: msg.timestamp.toISOString()
        })),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      debouncedSave(conversation);
    }
  }, [messages, currentConversationId, debouncedSave]);

  // Auto-scroll to the latest message when messages change
  useEffect(() => {
    if (messagesEndRef && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, messagesEndRef]);

  const handleNewConversation = async () => {
    try {
      if (!conversationsDirectory) {
        await initializeConversationsDirectory();
      }
      const newId = generateConversationId();
      setCurrentConversationId(newId);
      clearMessages();
      toast({
        title: "New Conversation",
        description: "Started a new conversation",
      });
    } catch (error) {
      console.error('Failed to create new conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create new conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectConversation = async (id: string) => {
    try {
      setCurrentConversationId(id);
      const conversation = await loadConversation(id);
      if (conversation) {
        loadMessages(conversation.messages);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteConversation(id);
      const updatedConversations = await getAllConversations();
      setConversations(updatedConversations);
      
      if (id === currentConversationId) {
        setCurrentConversationId(null);
        clearMessages();
      }
      toast({
        title: "Success",
        description: "Conversation deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
      if (personaDropdownRef.current && !personaDropdownRef.current.contains(event.target as Node)) {
        setIsPersonaDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      try {
        const message = inputValue;
        setInputValue(''); // Clear input box immediately
        setPartialMessage('');
        await sendMessage(message);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
      } catch (error) {
        console.error('Failed to send message:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleModelSelect = (model: string) => {
    setModel(model);
    setIsModelDropdownOpen(false);
    toast({
      title: "Model Changed",
      description: `Switched to ${formatModelName(model)}`,
    });
  };

  const handlePersonaSelect = (persona: string) => {
    setPersona(persona);
    setIsPersonaDropdownOpen(false);
    toast({
      title: "Persona Changed",
      description: `Switched to ${persona}`,
    });
  };

  // Format model name for display
  const formatModelName = (model: string) => {
    const parts = model.split('/');
    if (parts.length > 1) {
      return parts[1].split(':')[0];
    }
    return model;
  };

  return (
    <div className="flex h-screen">
      <ConversationsSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onNewConversation={handleNewConversation}
        isLoading={isLoading}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
          <div className="rounded-2xl glass-panel p-4 md:p-6 flex-grow flex flex-col h-full">
            {/* Controls Bar */}
            <div className="flex justify-between mb-2">
              {/* Model Selection Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center space-x-1 text-sm text-starry-text hover:text-purple-500 transition-colors"
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                >
                  <span>Model: {formatModelName(currentModel)}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isModelDropdownOpen && (
                  <div className="absolute top-8 left-0 z-10 w-48 rounded-md shadow-lg bg-black/80 backdrop-blur-sm border border-white/10">
                    <div className="py-1">
                      {availableModels.map((model) => (
                        <button
                          key={model}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            model === currentModel
                              ? 'bg-purple-600/20 text-purple-500'
                              : 'text-starry-text hover:bg-purple-600/10'
                          }`}
                          onClick={() => handleModelSelect(model)}
                        >
                          {formatModelName(model)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Persona Selection Dropdown */}
              <div className="relative" ref={personaDropdownRef}>
                <button
                  className="flex items-center space-x-1 text-sm text-starry-text hover:text-purple-500 transition-colors"
                  onClick={() => setIsPersonaDropdownOpen(!isPersonaDropdownOpen)}
                >
                  <span>Persona: {currentPersona}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isPersonaDropdownOpen && (
                  <div className="absolute top-8 right-0 z-10 w-48 rounded-md shadow-lg bg-black/80 backdrop-blur-sm border border-white/10">
                    <div className="py-1">
                      {availablePersonas.map((persona) => (
                        <button
                          key={persona.id}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            persona.id === currentPersona
                              ? 'bg-purple-600/20 text-purple-500'
                              : 'text-starry-text hover:bg-purple-600/10'
                          }`}
                          onClick={() => handlePersonaSelect(persona.id)}
                        >
                          {persona.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="chat-container flex-grow my-4 rounded-xl bg-black/20 overflow-y-auto backdrop-blur-sm">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center px-4 py-10 text-center">
                  <div className="w-16 h-16 mb-6 rounded-full glass-panel flex items-center justify-center animate-starshine">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-8 h-8 text-starry-highlight"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-starry-text text-glow">Welcome to MindfulCompanion</h3>
                  <p className="text-starry-muted max-w-md">
                    I'm here to listen and provide support when you need it. 
                    Share how you're feeling or what's on your mind.
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                 {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}

                  {partialMessage && (
                    <div className="chat-bubble-bot py-3 px-4 inline-flex animate-pulse-subtle">
                      <div className="text-starry-text whitespace-pre-line">{partialMessage}</div>
                    </div>
                  )}

                  {loading && !partialMessage && (
                    <div className="chat-bubble-bot animate-pulse-subtle py-3 px-4 inline-flex">
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            <div className="relative">
              <textarea
                ref={inputRef}
                className="w-full rounded-xl border-none bg-black/30 px-4 py-3 text-starry-text focus:ring-2 focus:ring-starry-highlight focus:outline-none resize-none"
                rows={2}
                placeholder="Type your message here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="absolute right-3 bottom-3 p-2 rounded-full bg-starry-highlight text-white hover:bg-opacity-80 transition-colors duration-300"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || loading}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
