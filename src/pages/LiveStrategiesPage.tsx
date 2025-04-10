
import React, { useState } from 'react';
import Header from '@/components/Header';
import { WalletData } from '@/components/WalletConnect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Star, Filter, ArrowUpDown, Check, X } from 'lucide-react';
import SocialShare from '@/components/SocialShare';

// Mock data for live strategies
const liveStrategies = [
  {
    id: 1,
    name: "Low-Risk SUI Staking",
    protocol: {
      name: "Scallop Protocol",
      logo: "🔷",
      type: "staking"
    },
    initialInvestment: 500,
    currentValue: 527.5,
    roi: 5.5,
    apy: 8.2,
    duration: "3 months",
    risk: "Low",
    users: 1243,
    rating: 4.8,
    bestFor: "Long-term holders",
    dos: ["Stake for minimum 1 month", "Compound rewards weekly", "Monitor protocol updates"],
    donts: ["Withdraw early (penalty applies)", "Ignore governance votes", "Stake 100% of your portfolio"]
  },
  {
    id: 2,
    name: "Moderate Yield Farming",
    protocol: {
      name: "Cetus AMM",
      logo: "🌊",
      type: "liquidity"
    },
    initialInvestment: 1000,
    currentValue: 1124,
    roi: 12.4,
    apy: 18.5,
    duration: "2 months",
    risk: "Moderate",
    users: 876,
    rating: 4.2,
    bestFor: "Balanced portfolios",
    dos: ["Diversify liquidity pairs", "Set stop-loss", "Rebalance monthly"],
    donts: ["Ignore impermanent loss", "Chase highest APY pools", "Over-leverage your position"]
  },
  {
    id: 3,
    name: "Aggressive Leverage Strategy",
    protocol: {
      name: "Turbos Finance",
      logo: "🚀",
      type: "leverage"
    },
    initialInvestment: 750,
    currentValue: 937.5,
    roi: 25,
    apy: 45.3,
    duration: "1 month",
    risk: "High",
    users: 432,
    rating: 3.9,
    bestFor: "Experienced traders",
    dos: ["Monitor positions daily", "Use clear exit strategy", "Start with small amounts"],
    donts: ["Max leverage on volatile tokens", "Ignore liquidation thresholds", "FOMO into trending pools"]
  },
  {
    id: 4,
    name: "Conservative SUI-USDC LP",
    protocol: {
      name: "NAVI Finance",
      logo: "🛳️",
      type: "liquidity"
    },
    initialInvestment: 2000,
    currentValue: 2060,
    roi: 3,
    apy: 6.1,
    duration: "4 months",
    risk: "Low",
    users: 1532,
    rating: 4.5,
    bestFor: "Stablecoin yield seekers",
    dos: ["DCA into the position", "Reinvest rewards", "Hold for 3+ months"],
    donts: ["Panic sell during market dips", "Ignore gas costs", "Forget to claim rewards"]
  },
  {
    id: 5,
    name: "High Yield Flash Loans",
    protocol: {
      name: "FlowX Finance",
      logo: "💧",
      type: "defi"
    },
    initialInvestment: 3000,
    currentValue: 2850,
    roi: -5,
    apy: -12.1,
    duration: "2 months",
    risk: "Very High",
    users: 215,
    rating: 3.2,
    bestFor: "DeFi experts only",
    dos: ["Understand the risks fully", "Test with small amounts first", "Set up monitoring alerts"],
    donts: ["Use borrowed funds", "Skip code verification", "Ignore red flags"]
  }
];

interface LiveStrategiesPageProps {
  walletData: WalletData | null;
  onWalletConnect: (walletData: WalletData) => void;
}

const LiveStrategiesPage: React.FC<LiveStrategiesPageProps> = ({ walletData, onWalletConnect }) => {
  const [sortKey, setSortKey] = useState<'apy' | 'users' | 'risk' | 'rating'>('apy');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);
  
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'very high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getRoiDisplay = (roi: number) => {
    if (roi > 0) {
      return (
        <span className="text-green-600 dark:text-green-400 flex items-center">
          <TrendingUp className="h-4 w-4 mr-1" />
          +{roi.toFixed(1)}%
        </span>
      );
    } else {
      return (
        <span className="text-red-600 dark:text-red-400 flex items-center">
          <TrendingDown className="h-4 w-4 mr-1" />
          {roi.toFixed(1)}%
        </span>
      );
    }
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 fill-opacity-50" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };
  
  const sortedStrategies = [...liveStrategies].sort((a, b) => {
    let comparison = 0;
    
    if (sortKey === 'apy') {
      comparison = a.apy - b.apy;
    } else if (sortKey === 'users') {
      comparison = a.users - b.users;
    } else if (sortKey === 'risk') {
      const riskValues: {[key: string]: number} = {
        'low': 1,
        'moderate': 2,
        'high': 3,
        'very high': 4
      };
      comparison = riskValues[a.risk.toLowerCase()] - riskValues[b.risk.toLowerCase()];
    } else if (sortKey === 'rating') {
      comparison = a.rating - b.rating;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (key: 'apy' | 'users' | 'risk' | 'rating') => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onWalletConnect={onWalletConnect} walletData={walletData} />
      
      <main className="container mx-auto flex-1 py-6 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter gradient-text">Live Strategies</h1>
            <p className="text-lg text-muted-foreground">Explore real-world strategies from our community</p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filter
              </Button>
              <select 
                className="text-sm border rounded-md py-1 px-2 bg-background"
                onChange={(e) => handleSort(e.target.value as any)}
                value={sortKey}
              >
                <option value="apy">Sort by APY</option>
                <option value="users">Sort by Users</option>
                <option value="risk">Sort by Risk</option>
                <option value="rating">Sort by Rating</option>
              </select>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {liveStrategies.length} strategies
            </div>
          </div>
          
          <div className="space-y-6">
            {sortedStrategies.map((strategy) => (
              <Card key={strategy.id} className={`overflow-hidden transition-all duration-200 ${selectedStrategy === strategy.id ? 'ring-2 ring-primary' : ''}`}>
                <div className="md:flex">
                  <div className="md:w-3/4">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{strategy.protocol.logo}</span>
                            <CardTitle>{strategy.name}</CardTitle>
                          </div>
                          <CardDescription>{strategy.protocol.name} • {strategy.protocol.type.charAt(0).toUpperCase() + strategy.protocol.type.slice(1)}</CardDescription>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center">
                            {getRatingStars(strategy.rating)}
                            <span className="ml-2 text-sm font-medium">{strategy.rating.toFixed(1)}</span>
                          </div>
                          <Badge variant="outline" className={getRiskColor(strategy.risk)}>
                            {strategy.risk} Risk
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Initial Investment</div>
                          <div className="font-semibold">${strategy.initialInvestment}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Current Value</div>
                          <div className="font-semibold">${strategy.currentValue}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">ROI</div>
                          <div className="font-semibold">{getRoiDisplay(strategy.roi)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">APY</div>
                          <div className="font-semibold text-green-600 dark:text-green-400">{strategy.apy.toFixed(1)}%</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          {strategy.users.toLocaleString()} users • Active for {strategy.duration}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedStrategy(selectedStrategy === strategy.id ? null : strategy.id)}
                          >
                            {selectedStrategy === strategy.id ? 'Close Details' : 'View Details'}
                          </Button>
                          <SocialShare 
                            strategy={{
                              protocol: strategy.protocol,
                              estimatedReturn: strategy.initialInvestment * (strategy.roi / 100),
                              estimatedApy: strategy.apy,
                              riskScore: strategy.risk === "Low" ? 3 : strategy.risk === "Moderate" ? 5 : 8,
                              liquidityRisk: strategy.risk.toLowerCase(),
                              impermanentLossRisk: strategy.protocol.type === "liquidity" ? "medium" : "low",
                              explanation: `${strategy.name}: ${strategy.bestFor}.`
                            }} 
                            investmentAmount={strategy.initialInvestment}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </div>
                  
                  {selectedStrategy === strategy.id && (
                    <div className="md:w-1/4 bg-secondary/30 p-4 md:p-6">
                      <h3 className="font-semibold mb-3">Strategy Details</h3>
                      <div className="text-sm mb-4">
                        <p className="mb-2">Best for: <span className="font-medium">{strategy.bestFor}</span></p>
                        
                        <h4 className="font-medium text-green-600 dark:text-green-400 mt-3 mb-1 flex items-center">
                          <Check className="h-4 w-4 mr-1" /> Do's
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {strategy.dos.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                        
                        <h4 className="font-medium text-red-600 dark:text-red-400 mt-3 mb-1 flex items-center">
                          <X className="h-4 w-4 mr-1" /> Don'ts
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {strategy.donts.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <Button className="w-full gradient-bg">
                        Clone This Strategy
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveStrategiesPage;
