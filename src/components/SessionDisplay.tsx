
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, RotateCcw } from "lucide-react";
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${label} copied successfully`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Login Session Active
        </CardTitle>
        <CardDescription>
          Successfully authenticated with {sessionData.platform}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Platform</label>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{sessionData.platform}</Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default" className="bg-green-500">
                {sessionData.loginStatus}
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Session ID</label>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 bg-muted px-2 py-1 rounded text-sm">
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

        <div>
          <label className="text-sm font-medium text-muted-foreground">Session Data</label>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 bg-muted px-2 py-1 rounded text-sm truncate">
              {sessionData.cookies}
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

        <div>
          <label className="text-sm font-medium text-muted-foreground">Created At</label>
          <p className="text-sm mt-1">
            {new Date(sessionData.timestamp).toLocaleString()}
          </p>
        </div>

        <Button onClick={onStartNew} className="w-full" variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Start New Session
        </Button>
      </CardContent>
    </Card>
  );
};

export default SessionDisplay;
