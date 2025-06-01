import { useState, useRef, useCallback, useEffect } from 'react';
import { Message } from '../types';

interface Persona {
  id: string;
  name: string;
  description: string;
}

// Fallback responses in case the API is unavailable
const fallbackResponses = [
  "I'm here to listen and support you. How are you feeling today?",
  "That sounds challenging. Would you like to tell me more about what's going on?",
  "Thank you for sharing that with me. What do you think might help in this situation?",
  "It's normal to feel that way. Remember that your feelings are valid.",
  "I'm sorry to hear you're going through this. Remember to be kind to yourself.",
  "Would it help to try a quick breathing exercise together? We could take a few deep breaths.",
  "Is there someone in your life who might be able to offer additional support right now?",
];

// Function to get a fallback response if the API fails
export const getFallbackResponse = (): string => {
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentModel, setCurrentModel] = useState('google/gemma-3-27b-it:free');
  const [currentPersona, setCurrentPersona] = useState('therapist');
  const [availablePersonas, setAvailablePersonas] = useState<Persona[]>([]);
  
  const availableModels = [
    'google/gemma-3-27b-it:free',
    'deepseek/deepseek-r1:free',
    'meta-llama/llama-3.3-70b-instruct:free'
  ];
  
  // Fetch personas from backend
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        console.log('Fetching personas from backend...');
        const response = await fetch('http://localhost:5000/api/personas');
        if (response.ok) {
          const data = await response.json();
          console.log('Received personas data:', data);
          const personas = Object.entries(data.personas).map(([id, details]: [string, any]) => ({
            id,
            name: details.name,
            description: details.description
          }));
          setAvailablePersonas(personas);
          setCurrentPersona(data.current_persona);
          console.log('Set current persona to:', data.current_persona);
        }
      } catch (error) {
        console.error('Error fetching personas:', error);
      }
    };
    
    fetchPersonas();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateBackendPersona = async (personaId: string) => {
    try {
      console.log('Updating backend persona to:', personaId);
      const response = await fetch('http://localhost:5000/api/set-persona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ persona: personaId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update persona');
      }
      
      const data = await response.json();
      console.log('Backend persona update response:', data);
      return data.current_persona;
    } catch (error) {
      console.error('Error updating persona:', error);
      return null;
    }
  };

  const updateBackendModel = async (modelId: string) => {
    try {
      console.log('Updating backend model to:', modelId);
      const response = await fetch('http://localhost:5000/api/set-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: modelId }),
      });
      
      if (!response.ok) {
        console.error('Failed to update model, status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to update model');
      }
      
      const data = await response.json();
      console.log('Backend model update response:', data);
      return data.current_model;
    } catch (error) {
      console.error('Error updating model:', error);
      return null;
    }
  };

  const handleSetPersona = async (personaId: string) => {
    console.log('handleSetPersona called with:', personaId);
    const updatedPersona = await updateBackendPersona(personaId);
    if (updatedPersona) {
      console.log('Setting current persona to:', updatedPersona);
      setCurrentPersona(updatedPersona);
    } else {
      console.error('Failed to update persona in backend');
    }
  };

  const handleSetModel = async (modelId: string) => {
    console.log('handleSetModel called with:', modelId);
    // First update the UI state immediately for better user experience
    setCurrentModel(modelId);
    
    // Then update the backend
    const updatedModel = await updateBackendModel(modelId);
    if (updatedModel) {
      console.log('Backend model updated to:', updatedModel);
      // If the backend returned a different model, update the UI to match
      if (updatedModel !== modelId) {
        console.log('Backend returned different model, updating UI to:', updatedModel);
        setCurrentModel(updatedModel);
      }
    } else {
      console.error('Failed to update model in backend');
      // Revert the UI state if backend update failed
      setCurrentModel(currentModel);
    }
  };

  const loadMessages = useCallback((storedMessages: Array<{ role: string; content: string; timestamp: string }>) => {
    const loadedMessages: Message[] = storedMessages.map(msg => ({
      id: Math.random().toString(36).substr(2, 9),
      sender: msg.role as 'user' | 'bot',
      content: msg.content,
      timestamp: new Date(msg.timestamp)
    }));
    setMessages(loadedMessages);
    setTimeout(scrollToBottom, 100);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
  
    console.log('Sending message with model:', currentModel, 'and persona:', currentPersona);
  
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
  
    const assistantId = `assistant-${Date.now()}`;
    let assistantMessage: Message = {
      id: assistantId,
      content: '',
      sender: 'bot',
      timestamp: new Date()
    };
  
    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setLoading(true);
  
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          model: currentModel,
          persona: currentPersona,
          stream: true // indicate streaming mode to backend
        }),
      });
  
      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
  
      if (!reader) throw new Error('Streaming not supported');
  
      let fullContent = '';
      let done = false;
  
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
  
        if (chunk) {
          fullContent += chunk;
  
          assistantMessage = {
            ...assistantMessage,
            content: fullContent
          };
  
          setMessages(prev => {
            const updated = [...prev];
            const index = updated.findIndex(msg => msg.id === assistantId);
            if (index !== -1) {
              updated[index] = assistantMessage;
            }
            return updated;
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
  
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
  
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  }, [currentModel, currentPersona])
  
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    loading,
    sendMessage,
    messagesEndRef,
    availableModels,
    currentModel,
    setModel: handleSetModel,
    availablePersonas,
    currentPersona,
    setPersona: handleSetPersona,
    loadMessages,
    clearMessages
  };
  };
  