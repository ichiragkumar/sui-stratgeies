
import React from 'react';
import Header from '@/components/Header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WalletData } from '@/components/WalletConnect';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Percent, CreditCard, CircleDollarSign, ArrowRight } from 'lucide-react';

const mockData = [
  {
    name: 'Jan',
    value: 2500,
  },
  {
    name: 'Feb',
    value: 3000,
  },
  {
    name: 'Mar',
    value: 2700,
  },
  {
    name: 'Apr',
    value: 3200,
  },
  {
    name: 'May',
    value: 3800,
  },
  {
    name: 'Jun',
    value: 3500,
  },
];

interface LendingPageProps {
  walletData: WalletData | null;
  onWalletConnect: (walletData: WalletData) => void;
}

const lendingOptions = [
  {
    protocol: "Scallop Protocol",
    symbol: "SUI",
    apy: 4.52,
    tvl: "$52.4M",
    risk: "Low",
    logo: "🔷"
  },
  {
    protocol: "NAVI Finance",
    symbol: "ETH",
    apy: 6.21,
    tvl: "$38.1M",
    risk: "Medium",
    logo: "🛳️"
  },
  {
    protocol: "Cetus AMM",
    symbol: "USDC",
    apy: 8.75,
    tvl: "$24.3M",
    risk: "Medium",
    logo: "🌊"
  },
  {
    protocol: "FlowX Finance",
    symbol: "BTC",
    apy: 3.89,
    tvl: "$41.7M",
    risk: "Low",
    logo: "💧"
  },
  {
    protocol: "Turbos Finance",
    symbol: "SUI",
    apy: 12.34,
    tvl: "$8.9M",
    risk: "High",
    logo: "🚀"
  }
];

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'Low': return 'text-green-600 dark:text-green-400';
    case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
    case 'High': return 'text-red-600 dark:text-red-400';
    default: return '';
  }
};

const LendingPage: React.FC<LendingPageProps> = ({ walletData, onWalletConnect }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onWalletConnect={onWalletConnect} walletData={walletData} />
      
      <main className="container mx-auto flex-1 py-6 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter gradient-text">Lending & Borrowing</h1>
            <p className="text-lg text-muted-foreground">Maximize yields on your assets with the best lending protocols</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">Deposit Assets</CardTitle>
                  <CardDescription>Earn passive income on your crypto</CardDescription>
                </div>
                <TrendingUp className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Asset to Deposit</label>
                      <select className="w-full rounded-md border border-input bg-background px-3 h-10">
                        <option value="sui">SUI</option>
                        <option value="eth">ETH</option>
                        <option value="usdc">USDC</option>
                        <option value="btc">BTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Amount</label>
                      <div className="flex">
                        <Input type="text" placeholder="0.0" />
                        <Button variant="outline" className="ml-2 whitespace-nowrap">Max</Button>
                      </div>
                      <div className="text-xs text-right mt-1 text-muted-foreground">
                        Balance: 10.45 SUI
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Estimated APY</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">4.52%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Protocol</span>
                      <span className="font-semibold">Scallop Finance</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Deposit Fee</span>
                      <span>0.0%</span>
                    </div>
                  </div>
                  
                  <Button className="w-full gradient-bg">
                    Deposit SUI <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Yield Insights</CardTitle>
                <CardDescription>Current APY trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={mockData}
                      margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" tickLine={false} axisLine={false} />
                      <YAxis hide />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Percent className="h-4 w-4 text-primary" />
                      <span className="text-sm">Highest APY</span>
                    </div>
                    <div className="text-2xl font-bold">12.34%</div>
                    <div className="text-xs text-muted-foreground">Turbos Finance</div>
                  </div>
                  
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CircleDollarSign className="h-4 w-4 text-primary" />
                      <span className="text-sm">TVL</span>
                    </div>
                    <div className="text-2xl font-bold">$165M</div>
                    <div className="text-xs text-muted-foreground">Total Value Locked</div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    View All Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Available Lending Protocols</CardTitle>
                  <CardDescription>Current rates across the Sui ecosystem</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select className="text-sm border-none bg-transparent">
                    <option>APY</option>
                    <option>TVL</option>
                    <option>Risk</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Protocol</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead className="text-right">APY</TableHead>
                      <TableHead className="text-right">TVL</TableHead>
                      <TableHead className="text-right">Risk</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lendingOptions.map((option) => (
                      <TableRow key={option.protocol + option.symbol}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{option.logo}</span>
                            <span>{option.protocol}</span>
                          </div>
                        </TableCell>
                        <TableCell>{option.symbol}</TableCell>
                        <TableCell className="text-right font-medium text-green-600 dark:text-green-400">
                          {option.apy.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right">{option.tvl}</TableCell>
                        <TableCell className={`text-right font-medium ${getRiskColor(option.risk)}`}>
                          {option.risk}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm">Deposit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LendingPage;
