# DramaForge

DramaForge is a web-based tool for analyzing and adapting drama/movie scripts. It supports writers' creative processes through structural analysis and visualization of scripts.

## 🚀 Key Features

### 📊 Character Analysis
- **Dialogue Analysis**
  - Statistical analysis and visualization of dialogue distribution
  - Pattern recognition in character dialogues
  - Character-specific dialogue highlighting
  - Sentiment analysis of dialogues

- **Appearance Pattern Analysis**
  - Stage time analysis and visualization
  - Character timeline (Gantt chart)
  - Character interaction pattern analysis
  - Scene presence tracking

### 🎬 Event Analysis
- **Structural Analysis**
  - Scene metadata analysis (type/time/location)
  - Unit-based timeline visualization
  - Three-act structure plot analysis
  - Story arc mapping

- **Detailed Analysis**
  - Unit-by-unit character composition
  - Dialogue topic and keyword extraction
  - Scene mood/tone analysis
  - Situation progression tracking
  - Dramatic tension visualization

### ✏️ Adaptation Support
- **Structure Modification**
  - Character merge/split functionality
  - Event structure reorganization
  - Scene sequence optimization
  - Plot point adjustment

- **Setting Management**
  - Background and timeline modifications
  - Character profile management
  - Plot point configuration
  - Scene context adjustment

## 🛠 Tech Stack

### Frontend
- **Core**: React 18
- **State Management**: Jotai
- **Visualization**
  - recharts: Statistical data visualization
  - reactflow: Relationship diagrams and flow charts
- **Styling**: CSS Modules

### Development Tools
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Code Quality**
  - ESLint: Code linting
  - Prettier: Code formatting
- **Version Control**: Git

## 📁 Project Structure

```
src/
├── components/           # React Components
│   ├── analysis/        # Analysis-related components
│   │   ├── characters/  # Character analysis
│   │   └── settings/    # Analysis settings
│   ├── editor/          # Script editor components
│   └── common/          # Shared components
├── services/            # Business Logic
│   ├── analysis/        # Analysis services
│   └── api/             # API communication
├── store/               # State management (Jotai)
├── styles/              # CSS styles
├── utils/               # Utility functions
└── assets/             # Static resources

public/
└── scripts/            # Sample script JSONs
```

## 🚦 Getting Started

### Prerequisites
- Node.js 16.0 or higher
- npm 7.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/dramaforge.git

# Navigate to project directory
cd dramaforge

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
VITE_API_KEY=your_api_key
```

## 🔍 Usage

1. Upload your script in JSON format
2. Navigate to the analysis dashboard
3. Use the various analysis tools to gain insights
4. Make adaptations using the editor
5. Export your modified script

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers at [contact@dramaforge.com](mailto:contact@dramaforge.com).
