
import React from 'react';
import { Boxes, PieChart, Wallet } from 'lucide-react';

const Header = () => {
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
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary">
              <PieChart className="h-4 w-4" />
              <span>Strategies</span>
            </li>
            <li className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary">
              <Wallet className="h-4 w-4" />
              <span>Connect Wallet</span>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
