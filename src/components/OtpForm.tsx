
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, Shield, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OtpFormProps {
  sessionId: string;
  platform: string;
  onSuccess: (sessionData: any) => void;
  onBack: () => void;
}

const OtpForm: React.FC<OtpFormProps> = ({
  sessionId,
  platform,
  onSuccess,
  onBack,
}) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a complete 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to backend
      console.log(`Submitting OTP ${otp} for session ${sessionId} on ${platform}`);
      
      // Mock API response
      setTimeout(() => {
        const mockSessionData = {
          sessionId,
          platform,
          cookies: 'mock_cookies_data',
          loginStatus: 'success',
          timestamp: new Date().toISOString(),
        };

        toast({
          title: "Login Successful",
          description: `Successfully logged into ${platform}`,
        });
        
        onSuccess(mockSessionData);
        setIsLoading(false);
      }, 2000);

    } catch (error) {
      console.error('OTP submission failed:', error);
      toast({
        title: "OTP Verification Failed",
        description: "Invalid OTP or session expired. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Enter OTP
        </CardTitle>
        <CardDescription>
          Enter the 6-digit OTP sent to your phone for {platform}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={isLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              disabled={isLoading}
              className="flex-1"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || otp.length !== 6}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OtpForm;
