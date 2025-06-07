
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PlatformSelectorProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

const platforms = [
  { id: 'blinkit', name: 'Blinkit', logo: '🛒' },
  { id: 'zepto', name: 'Zepto', logo: '⚡' },
  { id: 'instamart', name: 'Instamart', logo: '📦' },
];

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  onPlatformChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="platform">Select Grocery Platform</Label>
      <Select value={selectedPlatform} onValueChange={onPlatformChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a platform" />
        </SelectTrigger>
        <SelectContent>
          {platforms.map((platform) => (
            <SelectItem key={platform.id} value={platform.id}>
              <div className="flex items-center gap-2">
                <span>{platform.logo}</span>
                <span>{platform.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PlatformSelector;
