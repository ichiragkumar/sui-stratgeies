
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Brain, RefreshCw } from 'lucide-react';
import { RiskLevel } from '@/data/protocols';

interface NaturalLanguageInputProps {
  onSubmit: (amount: number, riskLevel: RiskLevel) => void;
  isLoading: boolean;
}

const EXAMPLE_PROMPTS = [
  "I want a low risk strategy for 50 SUI",
  "Suggest an aggressive strategy for 100 SUI",
  "What's a moderate risk strategy for 25 SUI?"
];

const NaturalLanguageInput: React.FC<NaturalLanguageInputProps> = ({ onSubmit, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const parseInput = (input: string) => {
    // Extract risk level
    let riskLevel: RiskLevel = 'moderate'; // Default
    
    if (input.match(/low risk|conservative|safe|minimal risk/i)) {
      riskLevel = 'conservative';
    } else if (input.match(/high risk|aggressive|risky|high yield/i)) {
      riskLevel = 'aggressive';
    } else if (input.match(/moderate|balanced|medium risk/i)) {
      riskLevel = 'moderate';
    }
    
    // Extract amount
    const amountMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:SUI|sui|Sui)/i);
    if (!amountMatch) {
      throw new Error("Couldn't detect an amount in SUI. Please specify an amount like '50 SUI'.");
    }
    
    const amount = parseFloat(amountMatch[1]);
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Please enter a valid positive amount.");
    }
    
    return { amount, riskLevel };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!inputValue.trim()) {
      setError("Please enter a request.");
      return;
    }
    
    try {
      const { amount, riskLevel } = parseInput(inputValue);
      onSubmit(amount, riskLevel);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process your request.");
    }
  };

  const useExamplePrompt = (prompt: string) => {
    setInputValue(prompt);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Textarea
            placeholder="Describe your investment strategy, e.g. 'I want a low risk strategy for 50 SUI'"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={3}
            className="resize-none"
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            className="gradient-bg flex-1"
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                <span>Processing...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <Brain className="h-4 w-4 mr-2" />
                <span>Generate Strategy</span>
              </span>
            )}
          </Button>
        </div>
      </form>
      
      <div>
        <p className="text-xs text-muted-foreground mb-2">Try an example:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => useExamplePrompt(prompt)}
            >
              <MessageSquare className="h-3 w-3 mr-1.5 text-muted-foreground" />
              {prompt}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NaturalLanguageInput;
