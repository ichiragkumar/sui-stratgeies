
import React, { useState } from 'react';
import Header from '@/components/Header';
import StrategyForm from '@/components/StrategyForm';
import StrategyCard from '@/components/StrategyCard';
import PortfolioDashboard from '@/components/PortfolioDashboard';
import { RiskLevel } from '@/data/protocols';
import { Strategy, generateStrategies, StrategyRequest } from '@/utils/strategyGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [recommendedStrategies, setRecommendedStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [activeStrategies, setActiveStrategies] = useState<any[]>([]);
  const { toast } = useToast();

  const handleStrategySubmit = (amount: number, riskLevel: RiskLevel) => {
    setIsLoading(true);
    setInvestmentAmount(amount);
    
    // Simulate API call
    setTimeout(() => {
      const request: StrategyRequest = {
        amount,
        riskLevel
      };
      
      const strategies = generateStrategies(request);
      setRecommendedStrategies(strategies);
      setIsLoading(false);
    }, 1500);
  };

  const handleExecuteStrategy = (strategy: Strategy) => {
    // Simulate execution of strategy
    toast({
      title: "Strategy Execution Initiated",
      description: `Executing ${strategy.protocol.name} strategy with ${investmentAmount} SUI`,
    });
    
    // Simulate processing time
    setTimeout(() => {
      const profit = Math.random() * 0.03 - 0.01; // Random profit between -1% and 2%
      const profitAmount = investmentAmount * profit;
      const currentValue = investmentAmount + profitAmount;
      
      const activeStrategy = {
        ...strategy,
        dateStarted: new Date(),
        initialInvestment: investmentAmount,
        currentValue: currentValue,
        profit: profitAmount,
        profitPercentage: profit * 100,
        status: 'active'
      };
      
      setActiveStrategies(prev => [...prev, activeStrategy]);
      
      toast({
        title: "Strategy Execution Completed",
        description: `Successfully deployed ${investmentAmount} SUI to ${strategy.protocol.name}`,
        variant: "default",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="container mx-auto flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter gradient-text">AI-Powered DeFi Strategy Agent</h1>
            <p className="text-xl text-muted-foreground">Personalized yield strategies for the Sui blockchain</p>
          </div>
          
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="generate">Generate Strategy</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-8">
              <div className="my-8">
                <StrategyForm onSubmit={handleStrategySubmit} isLoading={isLoading} />
              </div>
              
              {recommendedStrategies.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Recommended Strategies</h2>
                  <p className="text-muted-foreground">
                    Based on your risk profile and investment amount, here are personalized strategy recommendations:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {recommendedStrategies.map((strategy, index) => (
                      <StrategyCard 
                        key={index}
                        strategy={strategy}
                        onExecute={handleExecuteStrategy}
                        investmentAmount={investmentAmount}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="portfolio">
              <div className="my-8">
                <PortfolioDashboard activeStrategies={activeStrategies} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="border-t py-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Powered by Eliza OS on the Sui blockchain</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
