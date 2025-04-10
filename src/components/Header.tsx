
import React, { useState } from 'react';
import { Boxes, PieChart, Menu, ChartLine, Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import WalletConnect, { WalletData } from './WalletConnect';
import ThemeToggle from './ThemeToggle';
import AuthDialog from './AuthDialog';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onWalletConnect: (walletData: WalletData) => void;
  walletData: WalletData | null;
}

const Header: React.FC<HeaderProps> = ({ onWalletConnect, walletData }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [userData, setUserData] = useState<{ email: string; name?: string } | null>(null);
  const { toast } = useToast();
  const location = useLocation();

  const handleAuthSuccess = (data: { email: string; name?: string }) => {
    setUserData(data);
    toast({
      title: "Authentication successful",
      description: `Welcome${data.name ? ', ' + data.name : ''}!`,
    });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-background sticky top-0 z-10 border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <Boxes className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold gradient-text">SuiStrat</h1>
              <p className="text-xs text-muted-foreground">AI-Powered DeFi Strategy Agent</p>
            </div>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`flex items-center space-x-1 text-sm font-medium ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <ChartLine className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/lending" 
            className={`flex items-center space-x-1 text-sm font-medium ${isActive('/lending') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Wallet className="h-4 w-4" />
            <span>Lending</span>
          </Link>
          <Link 
            to="/strategies" 
            className={`flex items-center space-x-1 text-sm font-medium ${isActive('/strategies') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <PieChart className="h-4 w-4" />
            <span>Strategies</span>
          </Link>
          
          <ThemeToggle />
          
          {!userData ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAuthDialog(true)}
            >
              Sign in
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="font-medium"
              onClick={() => setUserData(null)}
            >
              {userData.name || userData.email.split('@')[0]}
            </Button>
          )}
          
          <WalletConnect onWalletConnect={onWalletConnect} />
        </nav>
        
        <div className="md:hidden flex items-center space-x-4">
          <ThemeToggle />
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {showMobileMenu && (
        <div className="md:hidden border-t p-4 bg-background">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 p-2 rounded-md ${
                isActive('/') ? 'bg-secondary text-foreground' : 'text-muted-foreground'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <ChartLine className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/lending" 
              className={`flex items-center space-x-2 p-2 rounded-md ${
                isActive('/lending') ? 'bg-secondary text-foreground' : 'text-muted-foreground'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <Wallet className="h-5 w-5" />
              <span>Lending</span>
            </Link>
            <Link 
              to="/strategies" 
              className={`flex items-center space-x-2 p-2 rounded-md ${
                isActive('/strategies') ? 'bg-secondary text-foreground' : 'text-muted-foreground'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <PieChart className="h-5 w-5" />
              <span>Strategies</span>
            </Link>
            <div className="pt-2 flex items-center justify-between">
              {!userData ? (
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowAuthDialog(true);
                    setShowMobileMenu(false);
                  }}
                >
                  Sign in
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setUserData(null)}
                >
                  {userData.name || userData.email.split('@')[0]}
                </Button>
              )}
              <div className="ml-2">
                <WalletConnect onWalletConnect={onWalletConnect} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <AuthDialog 
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthSuccess={handleAuthSuccess}
      />
    </header>
  );
};

export default Header;
