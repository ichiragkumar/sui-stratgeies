
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Clock, AlertTriangle } from 'lucide-react';
import { WalletData } from './WalletConnect';

interface UserProfileProps {
  walletData: WalletData;
}

const UserProfile: React.FC<UserProfileProps> = ({ walletData }) => {
  if (!walletData.connected) return null;
  
  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-500';
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">On-Chain Profile</CardTitle>
          <CardDescription>Your blockchain activity summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">On-Chain Score</div>
                <div className="mt-1 flex items-center">
                  <div className={`h-2.5 w-2.5 rounded-full ${getScoreColor(walletData.onChainScore)} mr-2`}></div>
                  <span className="font-medium">{walletData.onChainScore || 'N/A'}</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground">Network</div>
                <div className="mt-1 font-medium">{walletData.chain}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground">Balance</div>
                <div className="mt-1 font-medium">{walletData.balance}</div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Recent Transactions</h3>
                <Badge variant="outline">Last {walletData.recentTransactions?.length || 0} TXs</Badge>
              </div>
              
              {walletData.recentTransactions && walletData.recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {walletData.recentTransactions.map((tx, index) => (
                    <div key={tx.id} className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-secondary/50">
                      <div className="flex items-center">
                        {tx.type === 'Swap' && <Badge variant="outline" className="mr-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Swap</Badge>}
                        {tx.type === 'Transfer' && <Badge variant="outline" className="mr-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Transfer</Badge>}
                        {tx.type === 'Stake' && <Badge variant="outline" className="mr-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Stake</Badge>}
                        {tx.type === 'Unstake' && <Badge variant="outline" className="mr-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">Unstake</Badge>}
                        {tx.type === 'Claim' && <Badge variant="outline" className="mr-2 bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300">Claim</Badge>}
                        <span className="font-medium">{tx.amount}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        <span>{formatDate(tx.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground text-sm">
                  <AlertTriangle className="h-5 w-5 mx-auto mb-2" />
                  No recent transactions found
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
