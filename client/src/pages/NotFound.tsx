import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";
import MeteorShower from "@/components/MeteorShower";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="relative min-h-screen bg-black text-gray-100 overflow-x-hidden crt-scanlines crt-noise">
      <MeteorShower />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-xl mx-auto shadow-2xl border border-red-900/25 bg-black/80 backdrop-blur-xl text-gray-100">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-red-950/40 border border-red-700/30 shadow-[0_0_40px_rgba(220,38,38,0.25)]">
              <div className="absolute inset-0 rounded-full bg-red-600/10 animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-red-400" />
            </div>
          </div>

          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">404</h1>

          <h2 className="text-2xl font-semibold text-red-300 mb-4">
            Lost In The Void
          </h2>

          <p className="text-gray-300 mb-8 leading-relaxed tracking-wide text-sm">
            The page you are looking for couldn't be found.
            <br />
            Return to the command deck and try a different route.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-[0_10px_30px_rgba(220,38,38,0.35)] hover:shadow-[0_12px_40px_rgba(220,38,38,0.45)]"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
