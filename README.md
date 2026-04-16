# Tax Loss Harvesting Interface

A modern, responsive React-based web application designed to help users optimize their crypto taxes by strategically harvesting capital losses. It calculates and visualizes short-term and long-term capital gains, allowing users to select underperforming assets from their portfolio to offset gains and preview potential tax savings.

## 🚀 Live Demo
*(Your Vercel deployment link will go here once deployed)*

## ✨ Features

- **Pre-Harvesting & Post-Harvesting Analysis:** Compare realized capital gains before and after selecting assets to harvest.
- **Dynamic Savings Calculation:** Real-time updates showcasing potential tax savings as you select or deselect holdings.
- **Holdings Table:** A detailed list of personal assets including coin names, logos, average buy prices, current prices, and individual short/long term gains and balances.
- **Interactive UI Components:**
   - How It Works Tooltip: Contextual educational popover explaining tax loss harvesting.
   - Disclaimers Accordion: Expanding section highlighting important regulatory notes.
- **Modern Design:** Built with a visually rich, premium dark theme aesthetic using glassmorphism, gradients, and micro-animations to closely mirror the provided Figma design guidelines.
- **Responsive Layout:** Automatically scales across desktop, tablet, and mobile devices for a seamless experience.

## 🛠️ Technology Stack

- **React 19:** View library for creating component-based UI.
- **Vite:** Next-generation frontend tooling for blistering fast local development and optimized builds.
- **Vanilla CSS:** Custom-scoped utility and module classes leveraging CSS Variables (custom properties) for theming and deep control without external dependencies.
- **JavaScript (ES6+):** Project core logic, utility functions, and mock API data structuring.

## ⚙️ Mock API Implementation

To simulate real-world usage, this application utilizes simulated async API queries natively integrated via Promises layout in `src/api/mockApi.js`.

- `fetchHoldings()`: Returns an array of digital asset objects containing coin metrics, pricing details, and separate STCG (Short-Term Capital Gains) and LTCG profiles.
- `fetchCapitalGains()`: Returns the base capital gains snapshot object (profits and losses) reflecting the initial pre-harvesting state.

## 💻 Getting Started Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Taxloss-Harvesting.git
   cd Taxloss-Harvesting
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Visit the app:**
   Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

## 🌐 Deployment (Vercel)

This project has been pre-configured to deploy seamlessly on Vercel as a Single Page Application (SPA).

1. Push your repository to GitHub.
2. Log into your [Vercel account](https://vercel.com).
3. Click **Add New...** -> **Project**.
4. Import this repository from GitHub.
5. Vercel will automatically detect **Vite** as the framework.
6. Click **Deploy**. Vercel will manage the routing rules automatically using the included `vercel.json` file.

## 📝 Folder Structure

```
├── public/                 # Static assets like favicon
├── src/
│   ├── api/
│   │   └── mockApi.js      # Dummy API data and functions
│   ├── components/         # Reusable React components
│   │   ├── CapitalGainsCard.jsx
│   │   ├── Header.jsx
│   │   ├── HoldingsTable.jsx
│   │   └── InfoSections.jsx
│   ├── utils/
│   │   └── format.js       # Number formatting and helper logic
│   ├── App.css             # Component-specific styles
│   ├── App.jsx             # Main application and state management
│   ├── index.css           # Global theme variables and resets
│   └── main.jsx            # Entry point
├── .gitignore              # Git ignore configuration
├── index.html              # HTML Root Document
├── package.json            # Project dependencies and scripts
└── vercel.json           # Vercel SPA routing configuration
```

## ⚖️ Disclaimer

Tax-loss harvesting may have distinct treatments under different legal and regional environments. This UI dashboard serves as an interactive educational demonstration. It is not financial or legal advice. Always consult with a registered tax advisor regarding actual investments.
