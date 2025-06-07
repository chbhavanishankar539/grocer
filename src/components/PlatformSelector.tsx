
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight, Zap, Package, ShoppingCart } from "lucide-react";

interface PlatformSelectorProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

const platforms = [
  { 
    id: 'blinkit', 
    name: 'Blinkit', 
    icon: ShoppingCart,
    color: 'from-orange-500 to-red-500',
    description: 'Quick commerce delivery platform',
    features: ['10-minute delivery', 'Wide product range', 'Premium quality'],
    status: 'Active'
  },
  { 
    id: 'zepto', 
    name: 'Zepto', 
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    description: 'Ultra-fast grocery delivery',
    features: ['Lightning fast', 'Fresh groceries', 'Premium service'],
    status: 'Active'
  },
  { 
    id: 'instamart', 
    name: 'Instamart', 
    icon: Package,
    color: 'from-blue-500 to-cyan-500',
    description: 'Instant grocery delivery by Swiggy',
    features: ['Reliable delivery', 'Best prices', 'Quality assured'],
    status: 'Active'
  },
];

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  onPlatformChange,
}) => {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  return (
    <Card className="border-0 shadow-xl bg-card/80 backdrop-blur">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold mb-2">Select Grocery Platform</CardTitle>
        <CardDescription className="text-base">
          Choose your preferred grocery delivery platform to begin automation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {platforms.map((platform) => {
            const PlatformIcon = platform.icon;
            const isSelected = selectedPlatform === platform.id;
            const isHovered = hoveredPlatform === platform.id;
            
            return (
              <Card
                key={platform.id}
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  isSelected 
                    ? 'border-primary shadow-lg scale-[1.02]' 
                    : isHovered 
                    ? 'border-primary/50 shadow-md scale-[1.01]' 
                    : 'border-border hover:border-primary/30'
                }`}
                onMouseEnter={() => setHoveredPlatform(platform.id)}
                onMouseLeave={() => setHoveredPlatform(null)}
                onClick={() => onPlatformChange(platform.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center shadow-lg`}>
                        <PlatformIcon className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{platform.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {platform.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {platform.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {platform.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {isSelected && (
                        <div className="flex items-center gap-2 text-green-600 animate-fade-in">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                      <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${
                        isHovered ? 'translate-x-1' : ''
                      }`} />
                    </div>
                  </div>
                  
                  {(isSelected || isHovered) && (
                    <div className="mt-4 pt-4 border-t animate-fade-in">
                      <Button 
                        className="w-full" 
                        variant={isSelected ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlatformChange(platform.id);
                        }}
                      >
                        {isSelected ? 'Continue with ' + platform.name : 'Select ' + platform.name}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Secure Automation</p>
              <p className="text-xs text-muted-foreground">
                Your login sessions are encrypted and securely managed
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformSelector;
