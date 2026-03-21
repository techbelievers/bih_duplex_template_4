import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";

// Lazy load routes for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const StudioPage = lazy(() => import("./pages/StudioPage"));
const BlogContent = lazy(() => import("./components/BlogContent"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const ThankYou = lazy(() => import("./pages/ThankYou"));

// Loading component - uses theme from index.css
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
      <p className="mt-4 text-neutral-900 font-body">Loading...</p>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.snapSaveState) {
        window.snapSaveState();
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blogs/:post_slug" element={<BlogContent />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/:property_slug" element={<StudioPage />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;

