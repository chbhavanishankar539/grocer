
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Phone, Shield, CheckCircle, AlertCircle } from "lucide-react";
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
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const { toast } = useToast();

  const automationSteps = [
    'Launching headless browser...',
    'Navigating to platform...',
    'Locating login button...',
    'Entering phone number...',
    'Requesting OTP...',
    'Capturing session data...'
  ];

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / automationSteps.length);
          const stepIndex = Math.floor(newProgress / (100 / automationSteps.length));
          
          if (stepIndex < automationSteps.length) {
            setCurrentStep(automationSteps[stepIndex]);
          }
          
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 400);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 10);
  };

  const validatePhoneNumber = (number: string) => {
    return /^[6-9]\d{9}$/.test(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit Indian phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setCurrentStep(automationSteps[0]);

    try {
      console.log(`Initiating automated login for ${phoneNumber} on ${platform}`);
      
      setTimeout(() => {
        const mockSessionId = `session_${platform}_${Date.now()}`;
        toast({
          title: "OTP Sent Successfully",
          description: `Automation completed. OTP sent to ${phoneNumber}`,
        });
        onOtpSent(mockSessionId);
        setIsLoading(false);
      }, automationSteps.length * 400 + 500);

    } catch (error) {
      console.error('Login automation failed:', error);
      toast({
        title: "Automation Failed",
        description: "Failed to initiate login automation. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-card/80 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          Phone Number Authentication
        </CardTitle>
        <CardDescription className="text-base">
          Enter your phone number to begin automated login for {platform}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="phone" className="text-base font-medium">
              Phone Number
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">+91</span>
                <div className="h-4 w-px bg-border" />
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                className="pl-16 h-12 text-base"
                disabled={isLoading}
              />
              {phoneNumber.length > 0 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {validatePhoneNumber(phoneNumber) ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {phoneNumber.length > 0 && !validatePhoneNumber(phoneNumber) && (
              <p className="text-sm text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Please enter a valid 10-digit phone number
              </p>
            )}
          </div>

          {isLoading && (
            <div className="space-y-4 p-4 rounded-lg bg-muted/30 border animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Automation in Progress</h4>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">{currentStep}</span>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 text-base" 
            disabled={isLoading || !validatePhoneNumber(phoneNumber)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Running Automation...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-5 w-5" />
                Start Login Automation
              </>
            )}
          </Button>
        </form>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-xs font-medium">Secure Process</p>
            <p className="text-xs text-muted-foreground">End-to-end encryption</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <p className="text-xs font-medium">Automated</p>
            <p className="text-xs text-muted-foreground">No manual intervention</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneNumberForm;
