export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--mcp-background-primary)] text-[var(--mcp-text)]">
      {children}
    </div>
  );
} 