# Mindful Companion

A modern, accessible chat interface built with React, TypeScript, and Tailwind CSS.

## Features

- 💬 Real-time chat interface with markdown support
- 🎨 Beautiful, accessible UI with dark mode support
- 🔄 Conversation history management
- 🤖 Multiple AI model support
- 👤 Customizable AI personas
- 📱 Responsive design
- ♿ Accessibility features

## Prerequisites

- Node.js 16.x or later
- npm 7.x or later
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mindful-companion.git
cd mindful-companion
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_API_BASE_URL=your_api_base_url
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/        # React components
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── App.tsx          # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Accessibility

This project follows WCAG 2.1 guidelines and includes:

- ARIA labels and roles
- Keyboard navigation
- High contrast color schemes
- Screen reader support
- Focus management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [Lucide Icons](https://lucide.dev/)
