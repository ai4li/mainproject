import React from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      role="article"
      aria-label={`${isUser ? 'Your message' : 'Assistant message'}`}
    >
      <div
        className={`max-w-[85%] rounded-lg p-3 ${
          isUser
            ? 'bg-purple-600 text-white'
            : 'bg-purple-800 text-white'
        }`}
      >
        <div className="markdown-content prose prose-invert max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({node, ...props}) => <p className="text-white mb-2" {...props} />,
              li: ({node, ...props}) => <li className="text-white mb-1" {...props} />,
              a: ({node, ...props}) => (
                <a 
                  className="text-purple-200 hover:text-purple-100 underline" 
                  {...props} 
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
              code: ({node, ...props}) => (
                <code className="bg-purple-900 text-white px-1 py-0.5 rounded" {...props} />
              ),
              h1: ({node, ...props}) => <h1 className="text-white text-2xl font-bold mb-2" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-white text-xl font-bold mb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-white text-lg font-bold mb-2" {...props} />,
              h4: ({node, ...props}) => <h4 className="text-white text-base font-bold mb-2" {...props} />,
              h5: ({node, ...props}) => <h5 className="text-white text-sm font-bold mb-2" {...props} />,
              h6: ({node, ...props}) => <h6 className="text-white text-xs font-bold mb-2" {...props} />,
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-purple-400 pl-4 my-2 text-white" {...props} />
              ),
              ul: ({node, ...props}) => <ul className="text-white list-disc pl-4 mb-2" {...props} />,
              ol: ({node, ...props}) => <ol className="text-white list-decimal pl-4 mb-2" {...props} />,
              table: ({node, ...props}) => (
                <div className="overflow-x-auto">
                  <table className="text-white border-collapse border border-purple-400" {...props} />
                </div>
              ),
              th: ({node, ...props}) => (
                <th className="text-white border border-purple-400 px-4 py-2" {...props} />
              ),
              td: ({node, ...props}) => (
                <td className="text-white border border-purple-400 px-4 py-2" {...props} />
              ),
              pre: ({node, ...props}) => (
                <pre className="bg-purple-900 text-white p-2 rounded overflow-x-auto" {...props} />
              ),
              em: ({node, ...props}) => <em className="text-white italic" {...props} />,
              strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
              del: ({node, ...props}) => <del className="text-white line-through" {...props} />,
              hr: ({node, ...props}) => <hr className="border-purple-400 my-4" {...props} />
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <div 
          className="text-xs mt-2 text-purple-200"
          aria-label={`Message sent at ${new Date(message.timestamp).toLocaleTimeString()}`}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
