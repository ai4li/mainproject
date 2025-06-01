
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatInterface from '../components/ChatInterface';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col starry-background text-starry-text">
      <Header />
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-6 flex flex-col">
        <ChatInterface />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
