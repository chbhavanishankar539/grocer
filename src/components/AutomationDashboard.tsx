
import React, { useState } from 'react';
import PlatformSelector from './PlatformSelector';
import PhoneNumberForm from './PhoneNumberForm';
import OtpForm from './OtpForm';
import SessionDisplay from './SessionDisplay';

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

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setCurrentStep('phone');
  };

  const handleOtpSent = (newSessionId: string) => {
    setSessionId(newSessionId);
    setCurrentStep('otp');
  };

  const handleLoginSuccess = (data: SessionData) => {
    setSessionData(data);
    setCurrentStep('success');
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
    switch (currentStep) {
      case 'platform':
        return (
          <PlatformSelector
            selectedPlatform={selectedPlatform}
            onPlatformChange={handlePlatformChange}
          />
        );
      case 'phone':
        return (
          <PhoneNumberForm
            platform={selectedPlatform}
            onOtpSent={handleOtpSent}
          />
        );
      case 'otp':
        return (
          <OtpForm
            sessionId={sessionId}
            platform={selectedPlatform}
            onSuccess={handleLoginSuccess}
            onBack={handleBackToPhone}
          />
        );
      case 'success':
        return sessionData ? (
          <SessionDisplay
            sessionData={sessionData}
            onStartNew={handleStartNew}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Grocery Platform Login Automation
            </h1>
            <p className="text-muted-foreground">
              Automate login sessions for Blinkit, Zepto, and Instamart platforms
            </p>
          </div>

          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex justify-center space-x-2 mb-6">
              {['platform', 'phone', 'otp', 'success'].map((step, index) => (
                <div
                  key={step}
                  className={`h-2 w-12 rounded-full ${
                    ['platform', 'phone', 'otp', 'success'].indexOf(currentStep) >= index
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationDashboard;
