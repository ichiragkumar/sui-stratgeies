
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Strategy } from "@/utils/strategyGenerator";
import { Protocol } from "@/data/protocols";
import { Share2, Copy, Check, Twitter, Facebook, Linkedin, Instagram, Wand2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SocialShareProps {
  strategy: Strategy;
  investmentAmount: number;
}

const SocialShare: React.FC<SocialShareProps> = ({ strategy, investmentAmount }) => {
  const [copied, setCopied] = useState(false);
  
  const { protocol, estimatedApy } = strategy;
  
  const generateShareText = () => {
    return `I just set up a yield strategy on ${protocol.name} with SuiStrat for ${investmentAmount} SUI at ${estimatedApy.toFixed(2)}% APY! #DeFi #Sui #SuiStrat`;
  };
  
  const shareText = generateShareText();
  const shareUrl = 'https://suistrat.app';
  
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);
  
  const socialLinks = [
    { 
      name: 'Twitter',
      icon: Twitter, 
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      color: 'text-[#1DA1F2] bg-[#1DA1F2]/10'
    },
    { 
      name: 'WhatsApp',
      icon: () => <span className="text-lg">💬</span>, 
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      color: 'text-[#25D366] bg-[#25D366]/10'
    },
    { 
      name: 'Telegram',
      icon: () => <span className="text-lg">📱</span>, 
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      color: 'text-[#0088cc] bg-[#0088cc]/10'
    },
    { 
      name: 'LinkedIn',
      icon: Linkedin, 
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'text-[#0A66C2] bg-[#0A66C2]/10'
    },
    { 
      name: 'Facebook',
      icon: Facebook, 
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'text-[#1877F2] bg-[#1877F2]/10'
    },
    { 
      name: 'Instagram',
      icon: Instagram, 
      url: `https://www.instagram.com/?url=${encodedUrl}`,
      color: 'text-[#C13584] bg-[#C13584]/10'
    },
    { 
      name: 'Warpcast',
      icon: Wand2, 
      url: `https://warpcast.com/~/compose?text=${encodedText}&url=${encodedUrl}`,
      color: 'text-[#6E56CF] bg-[#6E56CF]/10'
    },
    { 
      name: 'TikTok',
      icon: () => <span className="text-lg">🎵</span>,
      url: `https://www.tiktok.com/upload?url=${encodedUrl}`,
      color: 'text-[#000000] bg-[#000000]/10 dark:text-white dark:bg-white/10'
    },
  ];
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <Share2 className="h-3.5 w-3.5" />
          <span>Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-screen max-w-xs p-4" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Share this strategy</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Let others know about your DeFi strategy on Sui
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((social) => (
              <a 
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full ${social.color} hover:opacity-80 transition-opacity`}
                aria-label={`Share on ${social.name}`}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          
          <div className="pt-2">
            <div className="flex">
              <div className="flex-1 text-xs truncate border rounded-l-md p-2 bg-muted">
                {shareText}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-l-none h-auto"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SocialShare;
