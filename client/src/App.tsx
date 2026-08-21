import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AgeGate } from "@/components/AgeGate";
import { GwaveLayout } from "@/components/GwaveLayout";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./lib/i18n";
import { Help } from "./pages/Help";
import { Roadmap } from "./pages/Roadmap";
import { About, AdminConsole, Checkout, CoaConsole, Contact, Home, KnowledgeLibrary, Newsfeed, Orders, Policy, ProductDetail, Services, Store, StrainDetail } from "./pages/GwavePages";

function PublicPage({ children }: { children: React.ReactNode }) {
  return <GwaveLayout>{children}</GwaveLayout>;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"}>{() => <PublicPage><Home /></PublicPage>}</Route>
      <Route path={"/store"}>{() => <PublicPage><Store /></PublicPage>}</Route>
      <Route path={"/products/:id"}>{params => <PublicPage><ProductDetail productId={Number(params.id)} /></PublicPage>}</Route>
      <Route path={"/knowledge"}>{() => <PublicPage><KnowledgeLibrary /></PublicPage>}</Route>
      <Route path={"/knowledge/:slug"}>{params => <PublicPage><StrainDetail slug={params.slug} /></PublicPage>}</Route>
      <Route path={"/news"}>{() => <PublicPage><Newsfeed /></PublicPage>}</Route>
      <Route path={"/services"}>{() => <PublicPage><Services /></PublicPage>}</Route>
      <Route path={"/about"}>{() => <PublicPage><About /></PublicPage>}</Route>
      <Route path={"/contact"}>{() => <PublicPage><Contact /></PublicPage>}</Route>
      <Route path={"/help"}>{() => <PublicPage><Help /></PublicPage>}</Route>
      <Route path={"/roadmap"}>{() => <PublicPage><Roadmap /></PublicPage>}</Route>
      <Route path={"/orders"}>{() => <PublicPage><Orders /></PublicPage>}</Route>
      <Route path={"/checkout"}>{() => <PublicPage><Checkout /></PublicPage>}</Route>
      <Route path={"/privacy"}>{() => <PublicPage><Policy type="privacy" /></PublicPage>}</Route>
      <Route path={"/terms"}>{() => <PublicPage><Policy type="terms" /></PublicPage>}</Route>
      <Route path={"/refunds"}>{() => <PublicPage><Policy type="refunds" /></PublicPage>}</Route>
      <Route path={"/shipping"}>{() => <PublicPage><Policy type="shipping" /></PublicPage>}</Route>
      <Route path={"/admin"} component={AdminConsole} />
      <Route path={"/admin/coa"} component={CoaConsole} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <LanguageProvider>
          <TooltipProvider>
            <AgeGate>
              <Toaster />
              <Router />
            </AgeGate>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
