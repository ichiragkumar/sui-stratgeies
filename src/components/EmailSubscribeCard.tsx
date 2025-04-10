
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const EmailSubscribeCard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock subscription
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Subscription successful",
        description: `We'll send updates to ${email}`,
      });
      setEmail('');
    }, 1000);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Stay Updated</CardTitle>
        <CardDescription>Get the latest DeFi strategies in your inbox</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex w-full items-center space-x-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="gradient-bg" disabled={isLoading}>
              {isLoading ? "Subscribing..." : (
                <>
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-0">
        We respect your privacy. No spam, only valuable insights.
      </CardFooter>
    </Card>
  );
};

export default EmailSubscribeCard;
