import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SiteLayout } from "./components/SiteLayout";
import AdminPage from "./pages/AdminPage";
import {
  AboutPage,
  ContactPage,
  FAQPage,
  LegalPage,
  NewsPage,
  ServicesPage,
} from "./pages/ContentPages";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import QuotePage from "./pages/QuotePage";
import TrackPage from "./pages/TrackPage";

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
          <Switch>
            <Route path="/admin" component={AdminPage} />
            <Route component={PublicRouter} />
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
