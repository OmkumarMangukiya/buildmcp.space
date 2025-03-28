import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Plus, Settings, Globe, Share2, Server, Download, Laptop, Cloud, Terminal, Code, GitFork, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  // Sample MCPs for the dashboard
  const myMcps = [
    { id: 1, name: "Cursor Assistant", platform: "Cursor", status: "online", lastUpdated: "2 hours ago" },
    { id: 2, name: "Claude Code Helper", platform: "Claude Desktop", status: "online", lastUpdated: "1 day ago" },
    { id: 3, name: "Documentation Generator", platform: "VSCode", status: "offline", lastUpdated: "3 days ago" },
    { id: 4, name: "Test Case Creator", platform: "Cursor", status: "online", lastUpdated: "5 hours ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 w-64 border-r border-border bg-card hidden lg:block animate-fade-in">
        <div className="flex h-14 items-center border-b px-4">
          <h1 className="text-xl font-bold text-primary">MCP Builder</h1>
        </div>
        <nav className="space-y-1 p-2">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Code className="h-4 w-4" />
            My MCPs
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Globe className="h-4 w-4" />
            Marketplace
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Server className="h-4 w-4" />
            Deployments
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </nav>
        
        <div className="absolute bottom-4 w-full px-4">
          <Button className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Create New MCP
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background px-4 animate-fade-in">
          <Button variant="ghost" size="icon" className="mr-4 lg:hidden">
            <LayoutDashboard className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          <h1 className="text-lg font-semibold">Dashboard</h1>
          
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Create MCP
            </Button>
            <Avatar>
              <AvatarImage src="https://avatar.vercel.sh/user.png" />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6 animate-slide-up">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-muted-foreground">Your MCP dashboard overview</p>
          </div>

          {/* My MCPs */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">My MCPs</h2>
              <Button variant="outline" size="sm" className="gap-2">
                <Code className="h-4 w-4" />
                View All
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
              {myMcps.map((mcp) => (
                <Card key={mcp.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-medium">{mcp.name}</CardTitle>
                      <div className={`w-2 h-2 rounded-full ${mcp.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    <CardDescription>{mcp.platform}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Last updated</span>
                      <span className="text-muted-foreground">{mcp.lastUpdated}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Marketplace */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Marketplace</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Globe className="h-4 w-4 mr-1" />
                    Browse All
                  </Button>
                </div>
                <CardDescription>Discover and use MCPs from the community</CardDescription>
              </CardHeader>
              <CardFooter className="border-t p-3">
                <Button variant="ghost" size="sm" className="gap-2 w-full">
                  <GitFork className="h-4 w-4" />
                  Explore Marketplace
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}