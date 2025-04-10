
export interface Protocol {
  id: string;
  name: string;
  type: 'lending' | 'staking' | 'liquidity' | 'farming';
  riskLevel: 'low' | 'moderate' | 'high';
  apy: number;
  tvl: number; // in USD
  description: string;
  logo: string;
  audited: boolean;
  tokenSymbol: string;
}

export const protocols: Protocol[] = [
  {
    id: 'scallop-lending',
    name: 'Scallop Protocol',
    type: 'lending',
    riskLevel: 'low',
    apy: 8.3,
    tvl: 15000000,
    description: 'Sui\'s native money market protocol. Lend and borrow assets securely.',
    logo: '🦪',
    audited: true,
    tokenSymbol: 'SUI'
  },
  {
    id: 'navi-staking',
    name: 'NAVI Finance',
    type: 'staking',
    riskLevel: 'low',
    apy: 7.8,
    tvl: 12000000,
    description: 'Safe staking solution for SUI tokens with consistent rewards.',
    logo: '🧭',
    audited: true,
    tokenSymbol: 'SUI'
  },
  {
    id: 'cetus-sui-usdc',
    name: 'Cetus LP SUI-USDC',
    type: 'liquidity',
    riskLevel: 'moderate',
    apy: 14.2,
    tvl: 8500000,
    description: 'Provide liquidity for SUI-USDC trading pair on Cetus DEX.',
    logo: '🌊',
    audited: true,
    tokenSymbol: 'SUI-USDC LP'
  },
  {
    id: 'flowx-lending',
    name: 'FlowX Finance',
    type: 'lending',
    riskLevel: 'moderate',
    apy: 11.5,
    tvl: 5200000,
    description: 'Innovative lending protocol with leverage options on Sui.',
    logo: '💸',
    audited: true,
    tokenSymbol: 'SUI'
  },
  {
    id: 'turbos-farming',
    name: 'Turbos',
    type: 'farming',
    riskLevel: 'high',
    apy: 28.5,
    tvl: 3800000,
    description: 'High yield farming strategy with auto-compounding.',
    logo: '🚀',
    audited: false,
    tokenSymbol: 'TURBOS'
  },
  {
    id: 'kriya-stablecoin',
    name: 'Kriya Finance',
    type: 'farming',
    riskLevel: 'high',
    apy: 22.3,
    tvl: 4200000,
    description: 'Yield farming with Sui stablecoins and synthetic assets.',
    logo: '💎',
    audited: false,
    tokenSymbol: 'kUSD'
  }
];

export type RiskLevel = 'conservative' | 'moderate' | 'aggressive';

export const mapRiskLevel = (level: RiskLevel): 'low' | 'moderate' | 'high' => {
  switch (level) {
    case 'conservative': return 'low';
    case 'moderate': return 'moderate';
    case 'aggressive': return 'high';
    default: return 'moderate';
  }
};
