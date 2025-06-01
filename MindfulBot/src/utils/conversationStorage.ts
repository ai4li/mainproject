export interface StoredConversation {
  id: string;
  title: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  created_at: string;
  updated_at: string;
}

let conversationsDirectory: FileSystemDirectoryHandle | null = null;

// Export the conversationsDirectory variable
export { conversationsDirectory };

// Initialize the conversations directory
export const initializeConversationsDirectory = async () => {
  try {
    // Request permission to access the conversations directory
    conversationsDirectory = await window.showDirectoryPicker({
      id: 'conversations',
      mode: 'readwrite',
      startIn: 'documents'
    });
    return true;
  } catch (error) {
    console.error('Failed to initialize conversations directory:', error);
    return false;
  }
};

// Save conversation to either File System or localStorage
export const saveConversation = async (conversation: StoredConversation): Promise<void> => {
  try {
    if (conversationsDirectory) {
      // Save to File System
      const fileHandle = await conversationsDirectory.getFileHandle(`${conversation.id}.json`, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(conversation, null, 2));
      await writable.close();
    } else {
      // Save to localStorage
      const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
      const index = conversations.findIndex((c: StoredConversation) => c.id === conversation.id);
      if (index !== -1) {
        conversations[index] = conversation;
      } else {
        conversations.push(conversation);
      }
      localStorage.setItem('conversations', JSON.stringify(conversations));
    }
  } catch (error) {
    console.error('Save conversation error:', error);
  }
};

// Load conversation from either File System or localStorage
export const loadConversation = async (id: string): Promise<StoredConversation | null> => {
  try {
    if (conversationsDirectory) {
      // Load from File System
      const fileHandle = await conversationsDirectory.getFileHandle(`${id}.json`);
      const file = await fileHandle.getFile();
      const text = await file.text();
      return JSON.parse(text);
    } else {
      // Load from localStorage
      const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
      return conversations.find((c: StoredConversation) => c.id === id) || null;
    }
  } catch (error) {
    console.error('Load conversation error:', error);
    return null;
  }
};

// Get all conversations from either File System or localStorage
export const getAllConversations = async (): Promise<StoredConversation[]> => {
  try {
    if (conversationsDirectory) {
      // Get from File System
      const conversations: StoredConversation[] = [];
      for await (const [name, handle] of conversationsDirectory.entries()) {
        if (name.endsWith('.json') && handle.kind === 'file') {
          const fileHandle = handle as FileSystemFileHandle;
          const file = await fileHandle.getFile();
          const text = await file.text();
          conversations.push(JSON.parse(text));
        }
      }
      return conversations.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    } else {
      // Get from localStorage
      const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
      return conversations.sort((a: StoredConversation, b: StoredConversation) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    }
  } catch (error) {
    console.error('Get all conversations error:', error);
    return [];
  }
};

// Delete conversation from either File System or localStorage
export const deleteConversation = async (id: string): Promise<void> => {
  try {
    if (conversationsDirectory) {
      // Delete from File System
      await conversationsDirectory.removeEntry(`${id}.json`);
    } else {
      // Delete from localStorage
      const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
      const filteredConversations = conversations.filter((c: StoredConversation) => c.id !== id);
      localStorage.setItem('conversations', JSON.stringify(filteredConversations));
    }
  } catch (error) {
    console.error('Delete conversation error:', error);
  }
};

// Generate a unique conversation ID
export const generateConversationId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Export conversations to file
export const exportConversations = async (): Promise<void> => {
  try {
    const conversations = await getAllConversations();
    const blob = new Blob([JSON.stringify(conversations, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindful-companion-conversations-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export conversations error:', error);
  }
};

// Import conversations from file
export const importConversations = async (file: File): Promise<void> => {
  try {
    const text = await file.text();
    const conversations = JSON.parse(text);
    if (Array.isArray(conversations)) {
      for (const conversation of conversations) {
        await saveConversation(conversation);
      }
    }
  } catch (error) {
    console.error('Import conversations error:', error);
  }
}; 