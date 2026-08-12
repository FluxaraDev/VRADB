import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";
import ShootingStars from "@/components/ShootingStars";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <ShootingStars
        count={70}
        speedMultiplier={1.8}
        lengthMin={80}
        lengthMax={220}
        opacityMin={0.45}
        opacityMax={0.95}
        widthMin={1.5}
        widthMax={3}
      />

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 15%, rgba(220,38,38,0.18), transparent 22%), " +
            "radial-gradient(circle at 80% 10%, rgba(248,113,113,0.12), transparent 20%), " +
            "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(10,10,10,0.85) 35%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <Card className="relative w-full max-w-3xl overflow-hidden border border-red-900/30 bg-black/80 backdrop-blur-xl shadow-[0_0_80px_rgba(220,38,38,0.15)]">
          <CardContent className="px-8 py-10 text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-red-950/40 p-4 ring-1 ring-red-600/20">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>

            <p className="text-sm font-mono uppercase tracking-[0.44em] text-red-400 mb-3">
              ERROR — 404
            </p>
            <h1 className="text-6xl font-black uppercase tracking-[-0.03em] text-white sm:text-7xl">
              Page Not Found
            </h1>
            <p className="mt-5 text-sm leading-7 text-gray-300 max-w-2xl mx-auto">
              The route you tried to reach has been vaporized by a meteor shower.
              <br />
              Head back to the main console and keep your VR ADB mission alive.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={handleGoHome}
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-red-700/10 transition-all duration-200 hover:bg-red-500"
              >
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </div>

            <div className="mt-10 text-[11px] uppercase tracking-[0.32em] text-gray-600">
              <span className="text-red-500">SYSTEM</span> &middot; 404 ERROR &middot; STABILIZE NAVIGATION
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
