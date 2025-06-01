import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Test Page</h1>
        <p className="mb-4">If you can see this, the basic rendering is working.</p>
        <div className="p-4 bg-indigo-600 rounded-lg">
          <p>This is a test component to diagnose rendering issues.</p>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 