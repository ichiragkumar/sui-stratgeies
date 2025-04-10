import { protocols, Protocol, RiskLevel, mapRiskLevel } from '../data/protocols';

export interface Strategy {
  protocol: Protocol;
  allocationPercentage: number;
  estimatedReturn: number; // In dollars
  estimatedApy: number;
  riskScore: number; // 1-10
  liquidityRisk: 'low' | 'medium' | 'high';
  impermanentLossRisk: 'none' | 'low' | 'medium' | 'high';
  explanation: string;
}

export interface StrategyRequest {
  amount: number;
  riskLevel: RiskLevel;
}

// Market conditions simulation
const MARKET_CONDITIONS = {
  bullish: 1.2,   // 20% boost to yields in bull markets
  neutral: 1.0,   // baseline
  bearish: 0.8,   // 20% reduction in yields in bear markets
};

// Current market mood - this would come from a real market data API
const currentMarketMood = (): 'bullish' | 'neutral' | 'bearish' => {
  // For demo purposes, let's randomly select a market condition
  const moods: ('bullish' | 'neutral' | 'bearish')[] = ['bullish', 'neutral', 'bearish'];
  return moods[Math.floor(Math.random() * moods.length)];
};

// Generate strategies based on user input
export const generateStrategies = (request: StrategyRequest): Strategy[] => {
  const { amount, riskLevel } = request;
  const mappedRiskLevel = mapRiskLevel(riskLevel);
  
  // Get current market condition
  const marketMood = currentMarketMood();
  const marketFactor = MARKET_CONDITIONS[marketMood];
  
  // Filter protocols based on risk level
  let eligibleProtocols = protocols.filter(p => {
    if (mappedRiskLevel === 'low') return p.riskLevel === 'low';
    if (mappedRiskLevel === 'moderate') return p.riskLevel === 'low' || p.riskLevel === 'moderate';
    return true; // For aggressive, include all risk levels
  });

  // Ensure we have at least 3 protocols
  if (eligibleProtocols.length < 3) {
    // Backfill with next risk level
    const backfillRiskLevel = mappedRiskLevel === 'low' ? 'moderate' : 'high';
    const backfillProtocols = protocols.filter(p => p.riskLevel === backfillRiskLevel);
    eligibleProtocols = [...eligibleProtocols, ...backfillProtocols].slice(0, 3);
  }

  // Sort protocols by their suitability for the current risk level and market conditions
  eligibleProtocols = sortProtocolsBySuitability(eligibleProtocols, mappedRiskLevel, marketMood);

  // Generate strategies
  return eligibleProtocols.slice(0, 3).map(protocol => {
    // Adjust APY based on current market conditions
    const adjustedApy = protocol.apy * marketFactor;
    
    // Calculate estimated return based on adjusted APY
    const estimatedReturn = (amount * adjustedApy / 100);
    
    // Generate risk scores based on protocol type and audited status
    const riskScore = calculateRiskScore(protocol, mappedRiskLevel);
    
    // Determine liquidity risk based on TVL
    const liquidityRisk = protocol.tvl > 10000000 ? 'low' : protocol.tvl > 5000000 ? 'medium' : 'high';
    
    // Calculate impermanent loss risk
    const impermanentLossRisk = calculateImpermanentLossRisk(protocol, marketMood);
    
    // Generate explanation
    const explanation = generateExplanation(protocol, amount, estimatedReturn, marketMood);

    return {
      protocol,
      allocationPercentage: 100,
      estimatedReturn,
      estimatedApy: adjustedApy,
      riskScore,
      liquidityRisk,
      impermanentLossRisk,
      explanation
    };
  });
};

const sortProtocolsBySuitability = (
  protocols: Protocol[], 
  riskLevel: 'low' | 'moderate' | 'high', 
  marketMood: 'bullish' | 'neutral' | 'bearish'
): Protocol[] => {
  return [...protocols].sort((a, b) => {
    // In a bull market, favor higher yield protocols for moderate and high risk
    if (marketMood === 'bullish' && riskLevel !== 'low') {
      return b.apy - a.apy;
    }
    
    // In a bear market, prioritize safety and audited protocols
    if (marketMood === 'bearish') {
      // First compare audit status
      if (a.audited !== b.audited) {
        return a.audited ? -1 : 1;
      }
      // Then compare TVL for security
      return b.tvl - a.tvl;
    }
    
    // In neutral market or for low risk in bull market, balance yield and security
    if (a.riskLevel !== b.riskLevel) {
      const riskOrder = { low: 1, moderate: 2, high: 3 };
      return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    }
    
    // Otherwise sort by APY
    return b.apy - a.apy;
  });
};

const calculateImpermanentLossRisk = (
  protocol: Protocol, 
  marketMood: 'bullish' | 'neutral' | 'bearish'
): 'none' | 'low' | 'medium' | 'high' => {
  if (protocol.type !== 'liquidity') return 'none';
  
  // In volatile markets (bull or bear), impermanent loss risk is higher for LP positions
  if (marketMood !== 'neutral') {
    return 'high';
  }
  
  return 'medium';
};

const calculateRiskScore = (protocol: Protocol, userRiskLevel: 'low' | 'moderate' | 'high'): number => {
  // Base risk score from protocol's risk level
  let score = protocol.riskLevel === 'low' ? 2 : protocol.riskLevel === 'moderate' ? 5 : 8;
  
  // Adjust for audit status
  if (!protocol.audited) score += 1.5;
  
  // Adjust for TVL
  if (protocol.tvl < 5000000) score += 1;
  if (protocol.tvl > 15000000) score -= 0.5;
  
  // Adjust for protocol type
  if (protocol.type === 'liquidity') score += 1;
  if (protocol.type === 'farming') score += 2;
  if (protocol.type === 'staking') score -= 0.5;
  
  // Adjust based on user's risk preference
  if (userRiskLevel === 'low') {
    score += 0.5; // More conservative scoring for low risk users
  } else if (userRiskLevel === 'high') {
    score -= 1; // More aggressive scoring for high risk users
  }
  
  // Cap between 1-10
  return Math.max(1, Math.min(Math.round(score * 10) / 10, 10));
};

const generateExplanation = (
  protocol: Protocol, 
  amount: number, 
  estimatedReturn: number, 
  marketMood: 'bullish' | 'neutral' | 'bearish'
): string => {
  const monthlyReturn = estimatedReturn / 12;
  const dailyReturn = estimatedReturn / 365;
  
  let explanation = `Staking ${amount} SUI on ${protocol.name} would yield approximately ${estimatedReturn.toFixed(2)} SUI (${protocol.apy}% APY) over one year, `;
  explanation += `with monthly returns of around ${monthlyReturn.toFixed(2)} SUI and daily returns of ${dailyReturn.toFixed(4)} SUI. `;
  
  // Add market context
  if (marketMood === 'bullish') {
    explanation += 'Current market conditions are bullish, which could potentially enhance these returns. ';
  } else if (marketMood === 'bearish') {
    explanation += 'Current market conditions are bearish, so these estimates are conservative. ';
  } else {
    explanation += 'Current market conditions are stable. ';
  }
  
  if (protocol.audited) {
    explanation += 'This protocol has been professionally audited which reduces security risks. ';
  } else {
    explanation += 'This protocol has not been officially audited, which poses additional security risks. ';
  }
  
  if (protocol.type === 'lending') {
    explanation += 'As a lending protocol, your funds are used to provide loans to borrowers with collateral backing. ';
  } else if (protocol.type === 'liquidity') {
    explanation += 'As a liquidity provider, you may be exposed to impermanent loss if the price ratio between the paired assets changes significantly. ';
  } else if (protocol.type === 'farming') {
    explanation += 'Yield farming typically involves higher risks but offers potentially higher rewards through protocol incentives. ';
  } else if (protocol.type === 'staking') {
    explanation += 'Staking is generally lower risk compared to other DeFi activities, providing stable returns. ';
  }
  
  explanation += `The protocol currently has a Total Value Locked (TVL) of $${(protocol.tvl / 1000000).toFixed(1)} million.`;
  
  return explanation;
};

// Validate investment amount input
export const validateAmount = (value: string): string | null => {
  const numValue = Number(value);
  if (value.trim() === '') return 'Amount is required';
  if (isNaN(numValue)) return 'Amount must be a number';
  if (numValue <= 0) return 'Amount must be greater than 0';
  if (numValue > 1000000) return 'Amount is too large';
  return null;
};

export const getHistoricalYield = (protocol: Protocol, days: number = 30): number[] => {
  // In a real implementation, this would fetch historical data from a data provider
  // For demo purposes, we generate synthetic data
  const baseYield = protocol.apy / 365; // daily yield
  const volatility = protocol.riskLevel === 'low' ? 0.1 : protocol.riskLevel === 'moderate' ? 0.2 : 0.4;
  
  return Array(days).fill(0).map(() => {
    const randomFactor = 1 + (Math.random() * 2 - 1) * volatility;
    return baseYield * randomFactor;
  });
};

export const getSecurityScore = (protocol: Protocol): number => {
  let score = 50;
  
  // Audit bonus
  if (protocol.audited) score += 30;
  
  // TVL factor
  score += Math.min(20, Math.floor(protocol.tvl / 1000000));
  
  // Risk level adjustment
  if (protocol.riskLevel === 'low') score += 10;
  if (protocol.riskLevel === 'high') score -= 10;
  
  // Cap at 0-100
  return Math.max(0, Math.min(100, score));
};
