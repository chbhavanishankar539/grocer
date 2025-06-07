
import React, { useState } from 'react';
import PlatformSelector from './PlatformSelector';
import PhoneNumberForm from './PhoneNumberForm';
import OtpForm from './OtpForm';
import SessionDisplay from './SessionDisplay';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle, Clock, Smartphone, Shield, Database } from "lucide-react";

type FlowStep = 'platform' | 'phone' | 'otp' | 'success';

interface SessionData {
  sessionId: string;
  platform: string;
  cookies: string;
  loginStatus: string;
  timestamp: string;
}

const AutomationDashboard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('platform');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  const steps = [
    { id: 'platform', label: 'Select Platform', icon: Smartphone, description: 'Choose your grocery platform' },
    { id: 'phone', label: 'Phone Number', icon: Circle, description: 'Enter your phone number' },
    { id: 'otp', label: 'Verify OTP', icon: Shield, description: 'Enter verification code' },
    { id: 'success', label: 'Session Active', icon: Database, description: 'Login session established' },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progressValue = ((currentStepIndex + 1) / steps.length) * 100;

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setTimeout(() => setCurrentStep('phone'), 300);
  };

  const handleOtpSent = (newSessionId: string) => {
    setSessionId(newSessionId);
    setTimeout(() => setCurrentStep('otp'), 300);
  };

  const handleLoginSuccess = (data: SessionData) => {
    setSessionData(data);
    setTimeout(() => setCurrentStep('success'), 300);
  };

  const handleStartNew = () => {
    setCurrentStep('platform');
    setSelectedPlatform('');
    setSessionId('');
    setSessionData(null);
  };

  const handleBackToPhone = () => {
    setCurrentStep('phone');
    setSessionId('');
  };

  const renderCurrentStep = () => {
    const baseClasses = "transform transition-all duration-500 ease-in-out";
    
    switch (currentStep) {
      case 'platform':
        return (
          <div className={`${baseClasses} animate-fade-in`}>
            <PlatformSelector
              selectedPlatform={selectedPlatform}
              onPlatformChange={handlePlatformChange}
            />
          </div>
        );
      case 'phone':
        return (
          <div className={`${baseClasses} animate-fade-in`}>
            <PhoneNumberForm
              platform={selectedPlatform}
              onOtpSent={handleOtpSent}
            />
          </div>
        );
      case 'otp':
        return (
          <div className={`${baseClasses} animate-fade-in`}>
            <OtpForm
              sessionId={sessionId}
              platform={selectedPlatform}
              onSuccess={handleLoginSuccess}
              onBack={handleBackToPhone}
            />
          </div>
        );
      case 'success':
        return sessionData ? (
          <div className={`${baseClasses} animate-fade-in`}>
            <SessionDisplay
              sessionData={sessionData}
              onStartNew={handleStartNew}
            />
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Grocery Automation Hub
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Automate login sessions for Blinkit, Zepto, and Instamart platforms with advanced session management
            </p>
          </div>

          {/* Progress Section */}
          <Card className="mb-8 border-0 shadow-lg bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Automation Progress</h3>
                  <Badge variant="secondary" className="px-3 py-1">
                    Step {currentStepIndex + 1} of {steps.length}
                  </Badge>
                </div>
                
                <Progress value={progressValue} className="h-2" />
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;
                    const isPending = index > currentStepIndex;
                    
                    return (
                      <div
                        key={step.id}
                        className={`relative p-4 rounded-lg border transition-all duration-300 ${
                          isActive 
                            ? 'border-primary bg-primary/5 scale-105' 
                            : isCompleted 
                            ? 'border-green-200 bg-green-50/50' 
                            : 'border-muted bg-muted/20'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                            isActive 
                              ? 'bg-primary text-primary-foreground' 
                              : isCompleted 
                              ? 'bg-green-500 text-white' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : isActive ? (
                              <Clock className="h-4 w-4 animate-pulse" />
                            ) : (
                              <StepIcon className="h-4 w-4" />
                            )}
                          </div>
                          <h4 className={`font-medium text-sm ${
                            isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                          }`}>
                            {step.label}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {step.description}
                        </p>
                        
                        {isActive && (
                          <div className="absolute -top-1 -right-1">
                            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="space-y-6">
            {renderCurrentStep()}
          </div>

          {/* Status Footer */}
          {selectedPlatform && (
            <div className="mt-8 p-4 rounded-lg bg-muted/30 border animate-fade-in">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-muted-foreground">Connected to:</span>
                  <Badge variant="outline" className="capitalize">
                    {selectedPlatform}
                  </Badge>
                </div>
                {sessionData && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Session Active</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomationDashboard;
