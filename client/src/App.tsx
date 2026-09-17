import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SiteLayout } from "./components/SiteLayout";

const AdminPage = lazy(() => import("./pages/AdminPage"));
const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));
const QuotePage = lazy(() => import("./pages/QuotePage"));
const TrackPage = lazy(() => import("./pages/TrackPage"));
const CustomerDashboardPage = lazy(() => import("./pages/CustomerDashboardPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AboutPage = lazy(async () => ({ default: (await import("./pages/ContentPages")).AboutPage }));
const ContactPage = lazy(async () => ({ default: (await import("./pages/ContentPages")).ContactPage }));
const FAQPage = lazy(async () => ({ default: (await import("./pages/ContentPages")).FAQPage }));
const NewsPage = lazy(async () => ({ default: (await import("./pages/ContentPages")).NewsPage }));
const NewsDetailPage = lazy(async () => ({ default: (await import("./pages/ContentPages")).NewsDetailPage }));
const ServicesPage = lazy(async () => ({ default: (await import("./pages/ContentPages")).ServicesPage }));
const LegalPage = lazy(async () => ({ default: (await import("./pages/ContentPages")).LegalPage }));

function PublicRouter() {
  return (
    <SiteLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={AboutPage} />
        <Route path="/services" component={ServicesPage} />
        <Route path="/tracking" component={TrackPage} />
        <Route path="/quote" component={QuotePage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/faq" component={FAQPage} />
        <Route path="/news/:slug" component={NewsDetailPage} />
        <Route path="/news" component={NewsPage} />
        <Route path="/privacy">
          <LegalPage kind="privacy" />
        </Route>
        <Route path="/terms">
          <LegalPage kind="terms" />
        </Route>
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </SiteLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Suspense
            fallback={
              <div className="grid min-h-screen place-items-center bg-[#071b2f] text-white">
                <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-[#ff8358]" />
              </div>
            }
          >
            <Switch>
              <Route path="/login" component={LoginPage} />
              <Route path="/dashboard" component={CustomerDashboardPage} />
              <Route path="/admin" component={AdminPage} />
              <Route component={PublicRouter} />
            </Switch>
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
