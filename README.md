# MCP Builder - Model Context Protocol Builder Platform

## Overview

MCP Builder is a powerful platform that enables users to create, manage, and share Model Context Protocols (MCPs). It provides a seamless experience for building, and utilizing MCPs across different AI platforms.

## Features

### 🎯 Core Features

- **User Authentication**: Secure login system for personalized experience
- **Interactive Dashboard**:
  - View all your created MCPs
  - Create new MCPs

### 🚀 MCP Management

- **Detailed MCP Views**:
  - Comprehensive MCP information
  - Local setup instructions
  - Download options

### 🔧 MCP Generation

- **AI-Powered Creation**:
  - Platform-specific MCP generation
  - Support for multiple platforms:
    - Cursor
    - Claude Desktop
    - And more...
- **Interactive Creation Process**:
  - Natural language prompt-based generation
  - Custom feature integration


### ⚙️ Deployment Options

- One-click local setup

## Tech Stack

### Frontend

- **Next.js**: React framework for production
- **Tailwind CSS v4**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **TypeScript**: Type-safe development

### Backend

- **Supabase**:
  - Authentication
  - Database
  - Real-time subscriptions
  - Storage

### Payments

- **Lemon Squeezy**: Secure payment processing

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue or contact our team at [support email].

# buildmcp.space

Generate and deploy Model Context Protocol (MCP) servers for AI assistants.

## Features

- Design MCP servers through a simple web interface
- Generate complete, functional server code with AI assistance
- Deploy servers locally or to the cloud
- Configure servers for various MCP clients (Claude Desktop, Cursor AI, etc.)
- Manage your MCP server portfolio

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key (for AI-assisted server generation)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/buildmcp.space.git
cd buildmcp.space
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following content:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key_here
```

> **Important**: You need a valid OpenAI API key to use the AI-assisted MCP server generation feature. Without this key, the system will fall back to using template-based generation.

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1. **Create an MCP Server**:
   - Navigate to the "Create MCP" page
   - Enter a description of the MCP server you want to create
   - Choose target clients, deployment options, and language preferences
   - Click "Generate" to create your server

2. **Deploy Your Server**:
   - View generated server details and configuration
   - Select deployment target (local or cloud)
   - Follow deployment instructions

3. **Manage Your MCP Servers**:
   - View all your MCP servers in the dashboard
   - Edit, deploy, or delete existing servers

## Development

### Project Structure

- `src/app/` - Next.js pages and routes
- `src/components/` - React components
- `src/lib/` - Utility functions and shared logic
- `src/types/` - TypeScript type definitions
- `public/` - Static assets

### Key Technologies

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- OpenAI API
- MCP SDK

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) for the specification
- [Shadcn UI](https://ui.shadcn.com/) for the component library
- [OpenAI](https://openai.com/) for the API used in server generation
