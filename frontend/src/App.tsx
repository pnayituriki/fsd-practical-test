import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container-max flex items-center gap-4 py-3">
          <div className="text-lg font-semibold">
            Admin{" "}
            <span className="ml-2 text-xs px-2 py-0.5 rounded bg-accent/20 text-accent">
              Test
            </span>
          </div>
        </div>
      </header>

      <main className="container-max py-6">
        <Outlet />
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
