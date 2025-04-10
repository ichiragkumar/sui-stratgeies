
import React from 'react';
import { Boxes, PieChart } from 'lucide-react';
import WalletConnect, { WalletData } from './WalletConnect';

interface HeaderProps {
  onWalletConnect: (walletData: WalletData) => void;
  walletData: WalletData | null;
}

const Header: React.FC<HeaderProps> = ({ onWalletConnect, walletData }) => {
  return (
    <header className="bg-white dark:bg-gray-900 sticky top-0 z-10 border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Boxes className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold gradient-text">SuiStrat</h1>
            <p className="text-xs text-muted-foreground">AI-Powered DeFi Strategy Agent</p>
          </div>
        </div>
        <nav className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary">
              <PieChart className="h-4 w-4" />
              <span>Strategies</span>
            </a>
          </div>
          <WalletConnect onWalletConnect={onWalletConnect} />
        </nav>
      </div>
    </header>
  );
};

export default Header;
