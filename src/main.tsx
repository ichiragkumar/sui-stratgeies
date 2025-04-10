
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './hooks/use-theme.tsx'

// Create a style element to add theme transition
const styleElement = document.createElement('style');
styleElement.textContent = `
  * {
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }
`;
document.head.appendChild(styleElement);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light">
    <App />
  </ThemeProvider>
);
