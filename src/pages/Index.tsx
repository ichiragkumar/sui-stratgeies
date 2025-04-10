
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import StrategyForm from '@/components/StrategyForm';
import NaturalLanguageInput from '@/components/NaturalLanguageInput';
import StrategyCard from '@/components/StrategyCard';
import PortfolioDashboard from '@/components/PortfolioDashboard';
import UserProfile from '@/components/UserProfile';
import EmailSubscribeCard from '@/components/EmailSubscribeCard';
import { RiskLevel } from '@/data/protocols';
import { Strategy, generateStrategies, StrategyRequest } from '@/utils/strategyGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletData } from '@/components/WalletConnect';
import { Bot, Brain, Sparkles, Fingerprint, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [recommendedStrategies, setRecommendedStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [activeStrategies, setActiveStrategies] = useState<any[]>([]);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [usingNaturalLanguage, setUsingNaturalLanguage] = useState<boolean>(false);
  const { toast } = useToast();

  const handleStrategySubmit = (amount: number, riskLevel: RiskLevel) => {
    setIsLoading(true);
    setInvestmentAmount(amount);
    
    // Simulate API call to Eliza OS with the Sui plugin
    setTimeout(() => {
      const request: StrategyRequest = {
        amount,
        riskLevel
      };
      
      const strategies = generateStrategies(request);
      setRecommendedStrategies(strategies);
      setIsLoading(false);
      
      toast({
        title: "Strategies Generated",
        description: `Found ${strategies.length} strategies matching your criteria.`,
      });
    }, 1500);
  };

  const handleExecuteStrategy = (strategy: Strategy) => {
    // Only allow execution if wallet is connected
    if (!walletData?.connected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to execute strategies.",
        variant: "destructive",
      });
      return;
    }
    
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

  const handleWalletConnect = (data: WalletData) => {
    setWalletData(data);
    
    if (data.connected) {
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${data.chain} wallet`,
      });
    } else {
      setWalletData(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onWalletConnect={handleWalletConnect} walletData={walletData} />
      
      <main className="container mx-auto flex-1 py-6 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter gradient-text">AI-Powered DeFi Strategy Agent</h1>
            <p className="text-lg text-muted-foreground">Personalized yield strategies for the Sui blockchain</p>
          </div>
          
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="generate">Generate Strategy</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader className="px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Strategy Generator</CardTitle>
                        <CardDescription>Create personalized investment strategies based on your preferences</CardDescription>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <TabsList className="grid grid-cols-2 h-8">
                          <TabsTrigger 
                            value="simple" 
                            onClick={() => setUsingNaturalLanguage(false)}
                            className={!usingNaturalLanguage ? "bg-primary text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" : ""}
                          >
                            <Fingerprint className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Simple</span>
                          </TabsTrigger>
                          <TabsTrigger 
                            value="ai" 
                            onClick={() => setUsingNaturalLanguage(true)}
                            className={usingNaturalLanguage ? "bg-primary text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" : ""}
                          >
                            <Brain className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">AI</span>
                          </TabsTrigger>
                        </TabsList>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    {usingNaturalLanguage ? (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Bot className="h-5 w-5" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <p className="font-medium text-sm mb-1">Eliza OS Agent</p>
                            <p className="text-muted-foreground text-sm">
                              I'm your AI-powered DeFi strategy agent. Tell me what you're looking for, and I'll generate personalized yield strategies for you.
                            </p>
                          </div>
                        </div>
                        <NaturalLanguageInput onSubmit={handleStrategySubmit} isLoading={isLoading} />
                      </div>
                    ) : (
                      <StrategyForm onSubmit={handleStrategySubmit} isLoading={isLoading} />
                    )}
                  </CardContent>
                </Card>
                
                <EmailSubscribeCard />
              </div>
              
              {recommendedStrategies.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-semibold">Recommended Strategies</h2>
                  </div>
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
                  
                  <div className="text-center mt-6">
                    <Button asChild>
                      <Link to="/strategies" className="flex items-center">
                        View Community Strategies <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="portfolio" className="space-y-6">
              {walletData?.connected && (
                <UserProfile walletData={walletData} />
              )}
              <PortfolioDashboard 
                activeStrategies={activeStrategies} 
                walletConnected={Boolean(walletData?.connected)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="border-t py-4 mt-8">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            <span>Powered by</span> 
            <span className="gradient-text font-medium">Eliza OS</span>
            <span>on the Sui blockchain</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
