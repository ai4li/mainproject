import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessageBubble from '../MessageBubble';
import { Message } from '../../types';

describe('MessageBubble', () => {
  const mockMessage: Message = {
    sender: 'user',
    content: 'Hello, world!',
    timestamp: new Date('2024-01-01T12:00:00Z'),
  };

  it('renders user message correctly', () => {
    render(<MessageBubble message={mockMessage} />);
    
    // Check if message content is rendered
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    
    // Check if timestamp is rendered
    expect(screen.getByText(/12:00:00/)).toBeInTheDocument();
    
    // Check if correct ARIA label is present
    expect(screen.getByLabelText('Your message')).toBeInTheDocument();
  });

  it('renders bot message correctly', () => {
    const botMessage: Message = {
      ...mockMessage,
      sender: 'bot',
    };
    
    render(<MessageBubble message={botMessage} />);
    
    // Check if message content is rendered
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    
    // Check if timestamp is rendered
    expect(screen.getByText(/12:00:00/)).toBeInTheDocument();
    
    // Check if correct ARIA label is present
    expect(screen.getByLabelText('Assistant message')).toBeInTheDocument();
  });

  it('renders markdown content correctly', () => {
    const markdownMessage: Message = {
      ...mockMessage,
      content: '# Heading\n**Bold text**\n*Italic text*',
    };
    
    render(<MessageBubble message={markdownMessage} />);
    
    // Check if markdown is rendered correctly
    expect(screen.getByText('Heading')).toHaveClass('text-2xl');
    expect(screen.getByText('Bold text')).toHaveClass('font-bold');
    expect(screen.getByText('Italic text')).toHaveClass('italic');
  });

  it('renders links with correct attributes', () => {
    const linkMessage: Message = {
      ...mockMessage,
      content: '[Test Link](https://example.com)',
    };
    
    render(<MessageBubble message={linkMessage} />);
    
    const link = screen.getByText('Test Link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
}); 