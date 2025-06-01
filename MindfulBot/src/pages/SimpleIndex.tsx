import React from 'react';

const SimpleIndex: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="py-6">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-xl font-medium">
            Mindful<span className="text-indigo-400">Companion</span>
          </h1>
        </div>
      </header>
      
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Welcome to MindfulCompanion</h2>
          <p className="mb-4">This is a simplified version of the chat interface to help diagnose rendering issues.</p>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p>If you can see this, the basic rendering is working.</p>
          </div>
        </div>
      </main>
      
      <footer className="py-6">
        <div className="container max-w-4xl mx-auto px-4">
          <p className="text-sm text-gray-400">
            MindfulCompanion is here to provide support.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SimpleIndex; 