
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Strategy } from '@/utils/strategyGenerator';
import { BarChart3, PieChart, Calendar, ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface ActiveStrategy extends Strategy {
  dateStarted: Date;
  currentValue: number;
  initialInvestment: number;
  profit: number;
  profitPercentage: number;
  status: 'active' | 'pending' | 'completed';
}

interface PortfolioDashboardProps {
  activeStrategies: ActiveStrategy[];
  walletConnected: boolean;
}

const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({ activeStrategies, walletConnected }) => {
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const [chartType, setChartType] = useState<'performance' | 'allocation'>('performance');
  const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month' | 'all'>('week');
  
  const totalInvested = activeStrategies.reduce((sum, strategy) => sum + strategy.initialInvestment, 0);
  const totalValue = activeStrategies.reduce((sum, strategy) => sum + strategy.currentValue, 0);
  const totalProfit = totalValue - totalInvested;
  const totalProfitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
  
  // Generate performance data for chart
  const generatePerformanceData = () => {
    // This would be replaced with real historical data
    const performanceData = [];
    
    // If we have no strategies, return empty array
    if (activeStrategies.length === 0) return [];
    
    const periodsMap = { 
      day: 24, 
      week: 7, 
      month: 30, 
      all: 60 
    };
    
    const periods = periodsMap[timePeriod];
    const now = Date.now();
    
    for (let i = periods; i >= 0; i--) {
      const timestamp = new Date(now - i * (timePeriod === 'day' ? 3600000 : 86400000));
      
      // Generate a slightly random value for demo
      const baseValue = totalValue;
      const randomFactor = 1 + (Math.sin(i * 0.5) + Math.random() * 0.1) * 0.05; 
      const value = baseValue * randomFactor;
      
      performanceData.push({
        name: timePeriod === 'day' 
          ? timestamp.getHours() + ':00'
          : `${timestamp.getMonth() + 1}/${timestamp.getDate()}`,
        value: value.toFixed(2),
      });
    }
    
    return performanceData;
  };
  
  // Generate allocation data for pie chart
  const generateAllocationData = () => {
    const data = activeStrategies.map(strategy => ({
      name: strategy.protocol.name,
      value: strategy.currentValue,
      type: strategy.protocol.type,
    }));
    
    if (data.length === 0) {
      return [{ name: 'No strategies', value: 100 }];
    }
    
    return data;
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const performanceData = generatePerformanceData();
  const allocationData = generateAllocationData();
  
  // Calculate daily returns (mocked for demo)
  const calculateDailyReturns = () => {
    const result = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const randomReturn = (Math.random() * 2 - 0.5) * 1.2;
      
      result.unshift({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        return: randomReturn
      });
    }
    return result;
  };
  
  const dailyReturns = calculateDailyReturns();
  
  return (
    <div className="w-full space-y-6">
      {!walletConnected ? (
        <Card className="bg-muted/50">
          <CardContent className="py-12 text-center">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <div className="text-6xl">🔒</div>
              <h3 className="mt-4 text-xl font-semibold">Connect your Sui wallet</h3>
              <p className="mt-2 text-muted-foreground mb-6">
                Connect your wallet to view your portfolio and track your strategy performance.
              </p>
              <Button className="gradient-bg w-full max-w-xs">Connect Wallet</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalInvested.toFixed(2)} SUI</div>
                <p className="text-xs text-muted-foreground mt-1">Across {activeStrategies.length} active strategies</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalValue.toFixed(2)} SUI</div>
                <p className="text-xs text-muted-foreground mt-1">Last updated just now</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)} SUI
                  </div>
                  <div className={`ml-2 text-sm ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ({totalProfitPercentage >= 0 ? '+' : ''}{totalProfitPercentage.toFixed(2)}%)
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Since first investment</p>
              </CardContent>
            </Card>
          </div>
          
          {activeStrategies.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                <h3 className="text-lg font-medium">Portfolio Overview</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-background border rounded-md">
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-8 rounded-r-none"
                      onClick={() => setViewMode('list')}
                    >
                      <span className="sr-only">List view</span>
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'chart' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-8 rounded-l-none"
                      onClick={() => setViewMode('chart')}
                    >
                      <span className="sr-only">Chart view</span>
                      <PieChart className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button variant="outline" size="sm" className="h-8">
                    <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                    Refresh
                  </Button>
                </div>
              </div>
              
              {viewMode === 'list' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {activeStrategies.map((strategy, index) => (
                    <Card key={index} className="overflow-hidden card-hover">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xl">{strategy.protocol.logo}</span>
                              <CardTitle className="text-base">{strategy.protocol.name}</CardTitle>
                            </div>
                            <CardDescription className="text-xs">
                              Started {strategy.dateStarted.toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{strategy.estimatedApy.toFixed(1)}% APY</div>
                            <div className="text-xs text-muted-foreground">{strategy.protocol.type}</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Invested</div>
                            <div className="font-medium">{strategy.initialInvestment.toFixed(2)} SUI</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Current Value</div>
                            <div className="font-medium">{strategy.currentValue.toFixed(2)} SUI</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Profit</div>
                            <div className={`font-medium ${strategy.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {strategy.profit >= 0 ? '+' : ''}{strategy.profit.toFixed(2)} SUI
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Return</div>
                            <div className={`font-medium ${strategy.profitPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {strategy.profitPercentage >= 0 ? '+' : ''}{strategy.profitPercentage.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Portfolio Analysis</CardTitle>
                        <CardDescription>Visual overview of your strategies</CardDescription>
                      </div>
                      <div>
                        <Tabs value={chartType} onValueChange={(v) => setChartType(v as any)}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="performance">Performance</TabsTrigger>
                            <TabsTrigger value="allocation">Allocation</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {chartType === 'performance' ? (
                      <div className="space-y-4">
                        <div className="flex space-x-2 justify-end">
                          <Button 
                            variant={timePeriod === 'day' ? 'secondary' : 'outline'} 
                            size="sm"
                            onClick={() => setTimePeriod('day')}
                          >
                            24H
                          </Button>
                          <Button 
                            variant={timePeriod === 'week' ? 'secondary' : 'outline'} 
                            size="sm"
                            onClick={() => setTimePeriod('week')}
                          >
                            7D
                          </Button>
                          <Button 
                            variant={timePeriod === 'month' ? 'secondary' : 'outline'} 
                            size="sm"
                            onClick={() => setTimePeriod('month')}
                          >
                            30D
                          </Button>
                          <Button 
                            variant={timePeriod === 'all' ? 'secondary' : 'outline'} 
                            size="sm"
                            onClick={() => setTimePeriod('all')}
                          >
                            All
                          </Button>
                        </div>
                        
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart
                            width={500}
                            height={250}
                            data={performanceData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <XAxis 
                              dataKey="name" 
                              tick={{ fontSize: 12 }}
                              tickLine={false}
                              axisLine={false}
                              interval={Math.ceil(performanceData.length / 10)}
                            />
                            <YAxis 
                              hide={true}
                              domain={['dataMin - 1', 'dataMax + 1']}
                            />
                            <Tooltip 
                              formatter={(value: any) => [`${value} SUI`, 'Value']}
                              contentStyle={{
                                backgroundColor: 'var(--background)',
                                border: '1px solid var(--border)',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                              }}
                            />
                            <Bar 
                              dataKey="value" 
                              fill="var(--primary)" 
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="text-sm font-medium mb-3">Daily Returns</h4>
                          <div className="space-y-2">
                            {dailyReturns.map((day, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{day.date}</span>
                                <div className="flex items-center">
                                  {day.return > 0 ? (
                                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1.5" />
                                  ) : (
                                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1.5" />
                                  )}
                                  <span className={day.return > 0 ? 'text-green-500' : 'text-red-500'}>
                                    {day.return > 0 ? '+' : ''}{day.return.toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-full h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={allocationData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {allocationData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value: any) => [`${value.toFixed(2)} SUI`, 'Allocation']}
                                contentStyle={{
                                  backgroundColor: 'var(--background)',
                                  border: '1px solid var(--border)',
                                  borderRadius: '0.5rem',
                                  fontSize: '0.875rem',
                                }}
                              />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
                          {allocationData.map((entry, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <div className="text-sm">
                                <div className="font-medium">{entry.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {entry.type && entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground">No active strategies yet. Generate and execute a strategy to start.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default PortfolioDashboard;
