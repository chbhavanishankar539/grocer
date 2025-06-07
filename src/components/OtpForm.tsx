
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Progress } from "@/components/ui/progress";
import { Loader2, Shield, RotateCcw, Timer, CheckCircle } from "lucide-react";
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
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const { toast } = useToast();

  const verificationSteps = [
    'Restoring browser session...',
    'Loading saved cookies...',
    'Entering OTP code...',
    'Submitting verification...',
    'Capturing final session...',
    'Storing session data...'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast({
            title: "OTP Expired",
            description: "Please request a new OTP",
            variant: "destructive",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [toast]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / verificationSteps.length);
          const stepIndex = Math.floor(newProgress / (100 / verificationSteps.length));
          
          if (stepIndex < verificationSteps.length) {
            setCurrentStep(verificationSteps[stepIndex]);
          }
          
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

    if (timeLeft <= 0) {
      toast({
        title: "OTP Expired",
        description: "Please request a new OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setCurrentStep(verificationSteps[0]);

    try {
      console.log(`Submitting OTP ${otp} for session ${sessionId} on ${platform}`);
      
      setTimeout(() => {
        const mockSessionData = {
          sessionId,
          platform,
          cookies: `auth_token_${platform}=${Math.random().toString(36).substring(2)}; session_id=${sessionId}; platform=${platform}`,
          loginStatus: 'authenticated',
          timestamp: new Date().toISOString(),
        };

        toast({
          title: "Login Successful",
          description: `Successfully authenticated with ${platform}`,
        });
        
        onSuccess(mockSessionData);
        setIsLoading(false);
      }, verificationSteps.length * 500 + 500);

    } catch (error) {
      console.error('OTP verification failed:', error);
      toast({
        title: "Verification Failed",
        description: "Invalid OTP or session expired. Please try again.",
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
            <Shield className="h-5 w-5 text-primary" />
          </div>
          OTP Verification
        </CardTitle>
        <CardDescription className="text-base">
          Enter the 6-digit OTP sent to your phone for {platform}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Section */}
        <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-muted/30 border">
          <Timer className="h-5 w-5 text-primary" />
          <span className="font-medium">Time remaining:</span>
          <span className={`font-mono text-lg ${timeLeft < 60 ? 'text-red-500' : 'text-primary'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={isLoading || timeLeft <= 0}
            >
              <InputOTPGroup className="gap-3">
                <InputOTPSlot index={0} className="h-14 w-14 text-lg border-2" />
                <InputOTPSlot index={1} className="h-14 w-14 text-lg border-2" />
                <InputOTPSlot index={2} className="h-14 w-14 text-lg border-2" />
                <InputOTPSlot index={3} className="h-14 w-14 text-lg border-2" />
                <InputOTPSlot index={4} className="h-14 w-14 text-lg border-2" />
                <InputOTPSlot index={5} className="h-14 w-14 text-lg border-2" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {isLoading && (
            <div className="space-y-4 p-4 rounded-lg bg-muted/30 border animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Verification in Progress</h4>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">{currentStep}</span>
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              disabled={isLoading}
              className="flex-1 h-12"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || otp.length !== 6 || timeLeft <= 0}
              className="flex-1 h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify OTP
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Session Info */}
        <div className="p-4 rounded-lg bg-muted/30 border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Session ID: {sessionId.slice(-8)}</p>
              <p className="text-xs text-muted-foreground">
                Secure session maintained during verification
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OtpForm;
