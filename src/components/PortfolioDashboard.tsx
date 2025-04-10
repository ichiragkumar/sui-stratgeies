
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Strategy } from '@/utils/strategyGenerator';

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
}

const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({ activeStrategies }) => {
  const totalInvested = activeStrategies.reduce((sum, strategy) => sum + strategy.initialInvestment, 0);
  const totalValue = activeStrategies.reduce((sum, strategy) => sum + strategy.currentValue, 0);
  const totalProfit = totalValue - totalInvested;
  const totalProfitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
  
  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvested.toFixed(2)} SUI</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalValue.toFixed(2)} SUI</div>
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
          </CardContent>
        </Card>
      </div>

      {activeStrategies.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Active Strategies</h3>
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
        </div>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">No active strategies yet. Generate and execute a strategy to start.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PortfolioDashboard;
