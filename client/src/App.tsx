import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import ADBArchive from "./pages/ADBArchive";
import Home from "./pages/Home";
import Commands from "./pages/Commands";
import ShizukuHelp from "./pages/ShizukuHelp";
import AdbCalendarPage from "./pages/AdbCalendar";
import DailyAdbBanner from "./components/DailyAdbBanner";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/commands"} component={Commands} />
      <Route path={"/archive"} component={ADBArchive} />
      <Route path={"/calendar"} component={AdbCalendarPage} />
      <Route path={"/help"} component={ShizukuHelp} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const [location] = useLocation();
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <iframe
            id="hiddenAudioIframe"
            src="/hidden-audio-player.html"
            title="Hidden audio player"
            aria-hidden="true"
            style={{ display: "none" }}
          />
          {location !== "/" && <DailyAdbBanner />}
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
