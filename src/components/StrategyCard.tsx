
import React from 'react';
import { Strategy } from '@/utils/strategyGenerator';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle, Info, Play } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StrategyCardProps {
  strategy: Strategy;
  onExecute: (strategy: Strategy) => void;
  investmentAmount: number;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, onExecute, investmentAmount }) => {
  const { protocol, estimatedReturn, estimatedApy, riskScore, liquidityRisk, impermanentLossRisk, explanation } = strategy;
  
  const getRiskColor = (score: number) => {
    if (score <= 3) return 'bg-green-500';
    if (score <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'none': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <Card className="w-full overflow-hidden card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{protocol.logo}</span>
              <CardTitle>{protocol.name}</CardTitle>
            </div>
            <CardDescription className="mt-1">{protocol.type.charAt(0).toUpperCase() + protocol.type.slice(1)}</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-end">
                  <div className="text-xl font-bold gradient-text">{estimatedApy.toFixed(1)}% APY</div>
                  <span className="text-xs text-muted-foreground">Est. {estimatedReturn.toFixed(2)} SUI / year</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Annual Percentage Yield</p>
                <p className="text-xs text-muted-foreground">Based on current market conditions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3 space-y-4">
        <div className="mt-2">
          <div className="flex justify-between mb-1 text-xs">
            <span>Risk Score</span>
            <span className="font-medium">{riskScore}/10</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full ${getRiskColor(riskScore)}`} 
              style={{ width: `${riskScore * 10}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className={getRiskBadgeColor(liquidityRisk)}>
            Liquidity: {liquidityRisk.charAt(0).toUpperCase() + liquidityRisk.slice(1)}
          </Badge>
          <Badge variant="outline" className={getRiskBadgeColor(impermanentLossRisk)}>
            Imp. Loss: {impermanentLossRisk.charAt(0).toUpperCase() + impermanentLossRisk.slice(1)}
          </Badge>
          {protocol.audited ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              <Check size={14} className="mr-1" /> Audited
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
              <AlertTriangle size={14} className="mr-1" /> Not Audited
            </Badge>
          )}
        </div>
        
        <Separator />
        
        <div className="text-sm text-muted-foreground">
          <p className="line-clamp-3">{explanation}</p>
          <button className="text-xs text-primary font-medium mt-1">Read more</button>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full gradient-bg" 
          onClick={() => onExecute(strategy)}
        >
          <Play className="h-4 w-4 mr-2" /> Execute Strategy
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StrategyCard;
