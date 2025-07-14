import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  GitBranch,
  GitCommit,
  Github,
  Loader2,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface LoginProps {
  onLogin: (userData: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (typeof window !== "undefined" && window.electronAPI) {
        // Electron GitHub OAuth flow
        const result = await window.electronAPI.showMessageBox({
          type: "question",
          title: "GitHub Authentication",
          message:
            "This will open your browser to authenticate with GitHub. Continue?",
          buttons: ["Continue", "Cancel"],
          defaultId: 0,
          cancelId: 1,
        });

        if (result.response === 0) {
          // Simulate GitHub OAuth for demo purposes
          setTimeout(() => {
            const mockUserData = {
              id: "123456",
              login: "github-user",
              name: "GitHub User",
              email: "user@github.com",
              avatar_url: "https://github.com/github.png",
              company: "GitHub Inc.",
            };
            onLogin(mockUserData);
            setIsLoading(false);
          }, 2000);
        } else {
          setIsLoading(false);
        }
      } else {
        // Web GitHub OAuth flow
        setTimeout(() => {
          const mockUserData = {
            id: "123456",
            login: "github-user",
            name: "GitHub User",
            email: "user@github.com",
            avatar_url: "https://github.com/github.png",
            company: "GitHub Inc.",
          };
          onLogin(mockUserData);
          setIsLoading(false);
        }, 2000);
      }
    } catch (err) {
      setError("Failed to authenticate with GitHub. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* App branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <GitBranch className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                MergeIQ
              </h1>
              <p className="text-sm text-muted-foreground">
                Intelligent Git Management
              </p>
            </div>
          </div>
        </div>

        {/* Login card */}
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Github className="w-8 h-8 text-foreground" />
            </div>
            <h2 className="text-xl font-medium text-foreground">
              Welcome to MergeIQ
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign in with your GitHub account to access your repositories and
              start managing your Git workflow with intelligence
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            {/* GitHub login button */}
            <Button
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="w-full h-12 bg-[#24292e] hover:bg-[#1a1e22] text-white font-medium shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Github className="w-5 h-5 mr-2" />
                  Continue with GitHub
                </>
              )}
            </Button>

            {/* Features showcase */}
            <div className="pt-4">
              <Separator className="mb-4" />
              <p className="text-xs text-muted-foreground text-center mb-4">
                What makes MergeIQ special:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Smart Workflow
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Intelligent commit suggestions and branch management
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                    <GitCommit className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Clean Interface
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Minimal design focused on productivity
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Team Ready
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Built for collaborative development
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Secure OAuth
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Privacy First
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to MergeIQ's terms of service and privacy
            policy
          </p>
        </div>
      </div>
    </div>
  );
}
