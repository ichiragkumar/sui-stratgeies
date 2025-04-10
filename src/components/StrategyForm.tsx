
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RiskLevel } from '@/data/protocols';
import { Brain } from 'lucide-react';
import { validateAmount } from '@/utils/strategyGenerator';

interface StrategyFormProps {
  onSubmit: (amount: number, riskLevel: RiskLevel) => void;
  isLoading: boolean;
}

const StrategyForm: React.FC<StrategyFormProps> = ({ onSubmit, isLoading }) => {
  const [amount, setAmount] = useState<number>(50);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('moderate');
  const [inputValue, setInputValue] = useState<string>("50");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<boolean>(false);

  useEffect(() => {
    if (touched) {
      const validationError = validateAmount(inputValue);
      setError(validationError);
    }
  }, [inputValue, touched]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setTouched(true);
    
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue);
    }
  };

  const handleSliderChange = (value: number[]) => {
    const newAmount = value[0];
    setAmount(newAmount);
    setInputValue(newAmount.toString());
    setTouched(true);
  };

  const handleRiskChange = (value: string) => {
    setRiskLevel(value as RiskLevel);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!error && amount > 0) {
      onSubmit(amount, riskLevel);
    } else {
      setTouched(true);
      setError(validateAmount(inputValue));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Investment Amount (SUI)</label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input 
                  type="text" 
                  value={inputValue} 
                  onChange={handleInputChange} 
                  className={`max-w-[120px] ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  onBlur={() => setTouched(true)}
                />
                {error && (
                  <p className="absolute text-red-500 text-xs mt-0.5">{error}</p>
                )}
              </div>
              <div className="flex-1">
                <Slider 
                  value={[amount]} 
                  min={1} 
                  max={1000} 
                  step={1} 
                  onValueChange={handleSliderChange}
                  className="py-2"
                  disabled={isLoading || Boolean(error)}
                />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>1 SUI</span>
                  <span>500 SUI</span>
                  <span>1000 SUI</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Risk Tolerance</label>
            <Select value={riskLevel} onValueChange={handleRiskChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservative</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="aggressive">Aggressive</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {riskLevel === 'conservative' && 'Lower risk, lower potential rewards. Focus on stable, audited protocols.'}
              {riskLevel === 'moderate' && 'Balanced risk-reward. Mix of stable protocols and some higher yield options.'}
              {riskLevel === 'aggressive' && 'Higher risk, higher potential rewards. Includes newer protocols and higher yield strategies.'}
            </p>
          </div>
          
          <div className="flex items-center">
            <Button 
              type="submit" 
              className="gradient-bg w-full" 
              disabled={isLoading || Boolean(error) || amount <= 0}
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing Market Data...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <Brain size={18} />
                  <span>Generate Strategy</span>
                </span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StrategyForm;
