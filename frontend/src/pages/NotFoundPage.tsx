import { Link } from "react-router-dom";
import { HomeIcon } from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-[60vh] space-y-6">
      <h1 className="text-4xl font-bold text-destructive">404</h1>
      <p className="text-muted-foreground text-lg">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Button asChild className="flex items-center gap-2">
        <Link to="/">
          <HomeIcon className="w-4 h-4" />
          Go back home
        </Link>
      </Button>
    </div>
  );
}
