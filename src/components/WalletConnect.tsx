
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, Coins, ExternalLink, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WalletInfo {
  name: string;
  type: 'sui' | 'evm' | 'solana';
  icon: string;
  downloadUrl: string;
}

const SUPPORTED_WALLETS: WalletInfo[] = [
  { name: 'Sui Wallet', type: 'sui', icon: '🔷', downloadUrl: 'https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil' },
  { name: 'Ethos Wallet', type: 'sui', icon: '🌊', downloadUrl: 'https://chrome.google.com/webstore/detail/ethos-sui-wallet/mcbigmjiafegjnnogedioegffbooigli' },
  { name: 'Suiet Wallet', type: 'sui', icon: '💧', downloadUrl: 'https://chrome.google.com/webstore/detail/suiet-sui-wallet/khpkpbbcccdmmclmpigdgddabeilkdpd' },
  { name: 'MetaMask', type: 'evm', icon: '🦊', downloadUrl: 'https://metamask.io/download/' },
  { name: 'Phantom', type: 'solana', icon: '👻', downloadUrl: 'https://phantom.app/' },
];

export interface WalletData {
  address: string;
  chain: string;
  balance: string;
  connected: boolean;
  onChainScore?: number;
  recentTransactions?: any[];
}

interface WalletConnectProps {
  onWalletConnect: (walletData: WalletData) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onWalletConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState<'sui' | 'evm' | 'solana' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);

  // Check if wallet is already connected
  useEffect(() => {
    const savedWalletData = localStorage.getItem('walletData');
    if (savedWalletData) {
      try {
        const parsed = JSON.parse(savedWalletData);
        setWalletData(parsed);
        onWalletConnect(parsed);
      } catch (e) {
        localStorage.removeItem('walletData');
      }
    }
  }, [onWalletConnect]);

  const connectWallet = async (walletInfo: WalletInfo) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // For demo purposes, we're mocking the wallet connection
      // In a real implementation, we would use the appropriate wallet provider SDK
      if (walletInfo.type === 'sui') {
        // Check if window.suiWallet exists (mocked check)
        const hasSuiWallet = Math.random() > 0.3; // Simulate 70% chance of having the wallet
        
        if (!hasSuiWallet) {
          setError(`${walletInfo.name} not detected. Please install it first.`);
          setIsConnecting(false);
          return;
        }
        
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate successful connection with mock data
        const mockData: WalletData = {
          address: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
          chain: 'Sui',
          balance: (Math.random() * 1000).toFixed(2) + ' SUI',
          connected: true,
          onChainScore: Math.floor(Math.random() * 100),
          recentTransactions: Array(5).fill(0).map((_, i) => ({
            id: '0x' + Math.random().toString(16).slice(2),
            type: ['Swap', 'Transfer', 'Stake', 'Unstake', 'Claim'][Math.floor(Math.random() * 5)],
            amount: (Math.random() * 100).toFixed(2) + ' SUI',
            timestamp: new Date(Date.now() - i * 86400000).toISOString(),
          }))
        };
        
        setWalletData(mockData);
        localStorage.setItem('walletData', JSON.stringify(mockData));
        onWalletConnect(mockData);
        setShowDialog(false);
      } else if (walletInfo.type === 'evm' || walletInfo.type === 'solana') {
        // Similar mock implementation for EVM and Solana
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: WalletData = {
          address: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
          chain: walletInfo.type === 'evm' ? 'Ethereum' : 'Solana',
          balance: (Math.random() * 10).toFixed(4) + (walletInfo.type === 'evm' ? ' ETH' : ' SOL'),
          connected: true,
          onChainScore: Math.floor(Math.random() * 100),
          recentTransactions: Array(3).fill(0).map((_, i) => ({
            id: '0x' + Math.random().toString(16).slice(2),
            type: ['Swap', 'Transfer', 'Stake'][Math.floor(Math.random() * 3)],
            amount: (Math.random() * 1).toFixed(4) + (walletInfo.type === 'evm' ? ' ETH' : ' SOL'),
            timestamp: new Date(Date.now() - i * 86400000).toISOString(),
          }))
        };
        
        setWalletData(mockData);
        localStorage.setItem('walletData', JSON.stringify(mockData));
        onWalletConnect(mockData);
        setShowDialog(false);
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('walletData');
    setWalletData(null);
    onWalletConnect({
      address: '',
      chain: '',
      balance: '',
      connected: false
    });
  };

  const handleConnectClick = () => {
    setSelectedWalletType('sui'); // Default to Sui wallets first
    setShowDialog(true);
  };

  return (
    <>
      {!walletData?.connected ? (
        <Button 
          onClick={handleConnectClick}
          variant="outline"
          className="rounded-full"
        >
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </Button>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
            <Coins className="h-3.5 w-3.5 mr-1.5" />
            <span className="font-medium">{walletData.balance}</span>
          </div>
          <Button 
            variant="outline" 
            className="rounded-full text-xs sm:text-sm"
            onClick={disconnectWallet}
          >
            {walletData.address.slice(0, 6)}...{walletData.address.slice(-4)}
          </Button>
        </div>
      )}
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              {selectedWalletType === 'sui' 
                ? 'Connect to a Sui-compatible wallet to use our DeFi services.'
                : 'No Sui wallet detected. You can try connecting with another blockchain wallet.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md flex items-start text-sm">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <div className="text-red-800 dark:text-red-300">{error}</div>
              </div>
            )}
            
            <div className="flex mb-4 border-b">
              <button 
                className={`px-4 py-2 ${selectedWalletType === 'sui' ? 'border-b-2 border-primary' : ''}`}
                onClick={() => setSelectedWalletType('sui')}
              >
                Sui
              </button>
              <button 
                className={`px-4 py-2 ${selectedWalletType === 'evm' ? 'border-b-2 border-primary' : ''}`}
                onClick={() => setSelectedWalletType('evm')}
              >
                EVM
              </button>
              <button 
                className={`px-4 py-2 ${selectedWalletType === 'solana' ? 'border-b-2 border-primary' : ''}`}
                onClick={() => setSelectedWalletType('solana')}
              >
                Solana
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {SUPPORTED_WALLETS.filter(w => w.type === selectedWalletType).map((wallet) => (
                <button
                  key={wallet.name}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary"
                  onClick={() => connectWallet(wallet)}
                  disabled={isConnecting}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{wallet.icon}</span>
                    <span>{wallet.name}</span>
                  </div>
                  <div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <div className="text-xs text-muted-foreground">
              Don't have a wallet?{" "}
              <a 
                href="https://docs.sui.io/guides/wallet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                Learn more
              </a>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletConnect;
