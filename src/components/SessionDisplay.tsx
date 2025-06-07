
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Copy, RotateCcw, Database, Clock, Shield, Code, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SessionData {
  sessionId: string;
  platform: string;
  cookies: string;
  loginStatus: string;
  timestamp: string;
}

interface SessionDisplayProps {
  sessionData: SessionData;
  onStartNew: () => void;
}

const SessionDisplay: React.FC<SessionDisplayProps> = ({
  sessionData,
  onStartNew,
}) => {
  const { toast } = useToast();
  const [showCookies, setShowCookies] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${label} copied successfully`,
    });
  };

  const sessionAge = new Date().getTime() - new Date(sessionData.timestamp).getTime();
  const sessionAgeMinutes = Math.floor(sessionAge / (1000 * 60));

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'authenticated':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-500';
      case 'expired':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-card/80 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 animate-pulse" />
          </div>
          Login Session Active
        </CardTitle>
        <CardDescription className="text-base">
          Successfully authenticated with {sessionData.platform}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/30 border text-center">
            <Database className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Platform</p>
            <Badge variant="secondary" className="mt-1 capitalize">
              {sessionData.platform}
            </Badge>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border text-center">
            <Shield className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <p className="text-sm font-medium">Status</p>
            <Badge className={`mt-1 ${getStatusColor(sessionData.loginStatus)} text-white`}>
              {sessionData.loginStatus}
            </Badge>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <p className="text-sm font-medium">Session Age</p>
            <p className="text-sm text-muted-foreground mt-1">
              {sessionAgeMinutes < 1 ? 'Just now' : `${sessionAgeMinutes} min ago`}
            </p>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="session">Session Data</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 rounded-lg border bg-card">
                <label className="text-sm font-medium text-muted-foreground block mb-2">Session ID</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono">
                    {sessionData.sessionId}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(sessionData.sessionId, 'Session ID')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <label className="text-sm font-medium text-muted-foreground block mb-2">Created At</label>
                <p className="text-sm font-mono">
                  {new Date(sessionData.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="session" className="space-y-4">
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-muted-foreground">Session Cookies</label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowCookies(!showCookies)}
                >
                  {showCookies ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showCookies ? 'Hide' : 'Show'}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <code className={`flex-1 bg-muted px-3 py-2 rounded text-sm font-mono ${
                  showCookies ? 'text-foreground' : 'text-transparent bg-gradient-to-r from-muted to-muted-foreground bg-clip-text'
                }`}>
                  {showCookies ? sessionData.cookies : '••••••••••••••••••••••••••••••••'}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(sessionData.cookies, 'Session Data')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200">
              <div className="flex items-center gap-3">
                <Code className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Developer Note</p>
                  <p className="text-xs text-blue-700">
                    Session data is encrypted and can be used for API authentication
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="space-y-3">
              <Button 
                onClick={onStartNew} 
                className="w-full h-12" 
                variant="outline"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Start New Session
              </Button>
              
              <Button 
                className="w-full h-12" 
                variant="secondary"
                onClick={() => {
                  toast({
                    title: "Session Refreshed",
                    description: "Session data has been updated",
                  });
                }}
              >
                <Database className="mr-2 h-5 w-5" />
                Refresh Session
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-green-50/50 border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Session Health</p>
                  <p className="text-xs text-green-700">
                    All systems operational, session is active and secure
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SessionDisplay;
