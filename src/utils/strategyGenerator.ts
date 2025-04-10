
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

// Generate strategies based on user input
export const generateStrategies = (request: StrategyRequest): Strategy[] => {
  const { amount, riskLevel } = request;
  const mappedRiskLevel = mapRiskLevel(riskLevel);
  
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

  // Generate strategies
  return eligibleProtocols.slice(0, 3).map(protocol => {
    // Calculate estimated return based on APY
    const estimatedReturn = (amount * protocol.apy / 100);
    
    // Generate risk scores based on protocol type and audited status
    const riskScore = calculateRiskScore(protocol, mappedRiskLevel);
    
    // Determine liquidity risk based on TVL
    const liquidityRisk = protocol.tvl > 10000000 ? 'low' : protocol.tvl > 5000000 ? 'medium' : 'high';
    
    // Calculate impermanent loss risk
    const impermanentLossRisk = protocol.type === 'liquidity' ? 'medium' : 
                               protocol.type === 'farming' ? 'low' : 'none';
    
    // Generate explanation
    const explanation = generateExplanation(protocol, amount, estimatedReturn);

    return {
      protocol,
      allocationPercentage: 100,
      estimatedReturn,
      estimatedApy: protocol.apy,
      riskScore,
      liquidityRisk,
      impermanentLossRisk,
      explanation
    };
  });
};

const calculateRiskScore = (protocol: Protocol, userRiskLevel: 'low' | 'moderate' | 'high'): number => {
  // Base risk score from protocol's risk level
  let score = protocol.riskLevel === 'low' ? 2 : protocol.riskLevel === 'moderate' ? 5 : 8;
  
  // Adjust for audit status
  if (!protocol.audited) score += 1;
  
  // Adjust for TVL
  if (protocol.tvl < 5000000) score += 1;
  
  // Adjust for protocol type
  if (protocol.type === 'liquidity') score += 1;
  if (protocol.type === 'farming') score += 2;
  
  // Cap at 10
  return Math.min(score, 10);
};

const generateExplanation = (protocol: Protocol, amount: number, estimatedReturn: number): string => {
  const monthlyReturn = estimatedReturn / 12;
  const dailyReturn = estimatedReturn / 365;
  
  let explanation = `Staking ${amount} SUI on ${protocol.name} would yield approximately ${estimatedReturn.toFixed(2)} SUI (${protocol.apy}% APY) over one year, `;
  explanation += `with monthly returns of around ${monthlyReturn.toFixed(2)} SUI and daily returns of ${dailyReturn.toFixed(4)} SUI. `;
  
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
  }
  
  explanation += `The protocol currently has a Total Value Locked (TVL) of $${(protocol.tvl / 1000000).toFixed(1)} million.`;
  
  return explanation;
};
