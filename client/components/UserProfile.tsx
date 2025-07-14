import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Settings,
  LogOut,
  Github,
  MapPin,
  Building,
  Users,
  GitBranch,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url} alt={user.name || user.login} />
            <AvatarFallback className="bg-primary/10">
              {(user.name || user.login)
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-3">
            {/* User header */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-lg">
                  {(user.name || user.login)
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.name || user.login}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  @{user.login}
                </p>
                {user.email && (
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            {/* User details */}
            <div className="space-y-2">
              {user.company && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Building className="h-3 w-3" />
                  <span>{user.company}</span>
                </div>
              )}

              {user.location && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{user.location}</span>
                </div>
              )}

              {user.bio && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>

            {/* GitHub stats */}
            <div className="flex items-center space-x-4 text-xs">
              {typeof user.public_repos === "number" && (
                <div className="flex items-center space-x-1">
                  <GitBranch className="h-3 w-3" />
                  <span>{user.public_repos} repos</span>
                </div>
              )}
              {typeof user.followers === "number" && (
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{user.followers} followers</span>
                </div>
              )}
            </div>

            {/* GitHub badge */}
            <Badge variant="outline" className="w-fit">
              <Github className="h-3 w-3 mr-1" />
              GitHub Account
            </Badge>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
