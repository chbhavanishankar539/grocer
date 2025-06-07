
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhoneNumberFormProps {
  platform: string;
  onOtpSent: (sessionId: string) => void;
}

const PhoneNumberForm: React.FC<PhoneNumberFormProps> = ({
  platform,
  onOtpSent,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to backend
      console.log(`Initiating login for ${phoneNumber} on ${platform}`);
      
      // Mock API response
      setTimeout(() => {
        const mockSessionId = `session_${Date.now()}`;
        toast({
          title: "OTP Sent Successfully",
          description: `OTP has been sent to ${phoneNumber}`,
        });
        onOtpSent(mockSessionId);
        setIsLoading(false);
      }, 2000);

    } catch (error) {
      console.error('Login initiation failed:', error);
      toast({
        title: "Login Failed",
        description: "Failed to initiate login. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Phone Number Login
        </CardTitle>
        <CardDescription>
          Enter your phone number to receive an OTP for {platform}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength={10}
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !phoneNumber}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              'Send OTP'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PhoneNumberForm;
