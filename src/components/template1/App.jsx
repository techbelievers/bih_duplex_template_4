import React, { Suspense, lazy } from "react";
import FloatingButtons from "./components/FloatingButtons"; // Critical component, not dynamically imported
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import Loader from "../loader/Loader";

// Dynamically import components
const Footer = lazy(() => import("./components/Footer"));
const Services = lazy(() => import("./components/Services"));
const MahareraInformation = lazy(() => import("./components/MahaReraInformation"));
const Gallery = lazy(() => import("./components/Gallery"));
const PropertyPriceTable = lazy(() => import("./components/PropertyPriceTable"));
const PropertyDetails = lazy(() => import("./components/PropertyDetails"));
const UnitLayout = lazy(() => import("./components/UnitLayout"));
const FloorPlans = lazy(() => import("./components/FloorPlans"));
const MasterPlan = lazy(() => import("./components/MasterPlan"));
const Amenities = lazy(() => import("./components/Amenities"));
const LocationMap = lazy(() => import("./components/LocationMap"));
const LocationHighlights = lazy(() => import("./components/LocationHighlights"));
const Video = lazy(() => import("./components/Video"));
const FAQ = lazy(() => import("./components/FAQ"));
const EMICalculator = lazy(() => import("./components/EMICalculator"));
const Blogs = lazy(() => import("./components/Blogs"));
const BankPartners = lazy(() => import("./components/BankPartners"));
const ContactUs = lazy(() => import("./components/ContactUs"));
const Adverties = lazy(() => import("./components/Advertisements"));

const Properties = lazy(() => import("./components/Properties"));

// Prefetch Properties component after page load
if (typeof window !== 'undefined') {
  // Use requestIdleCallback if available, otherwise setTimeout
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      import("./components/Properties");
    }, { timeout: 2000 });
  } else {
    setTimeout(() => {
      import("./components/Properties");
    }, 100);
  }
}

// Better Loading Fallback Component - theme from CSS variables
const LoadingFallback = () => (
  <div style={{
    minHeight: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--color-bg-light) 0%, var(--color-bg) 100%)',
    padding: '60px 20px'
  }}>
    <Loader />
  </div>
);

function App({ propertyDetails, colorTheme = 1 }) {
  const themeClass = `theme-${Math.min(16, Math.max(1, Number(colorTheme) || 1))}`;
  return (
    <div className={`App theme-redesign ${themeClass}`}>
      {/* Critical components - Load immediately */}
      <Suspense fallback={<LoadingFallback />}>
        <Header />
        <HeroBanner />
      </Suspense>

      {/* Properties - Separate Suspense for faster loading */}
      <Suspense fallback={<div style={{ minHeight: '300px' }}></div>}>
        <Properties />
      </Suspense>

      {/* Other components - Can load in parallel */}
      <Suspense fallback={<LoadingFallback />}>
        <Adverties />
        <ContactUs />
        <BankPartners />
        <EMICalculator />
        <PropertyDetails propertyDetails={propertyDetails}/>
        <Blogs />
        <FAQ />
        <Footer />
      </Suspense>

      {/* Always loaded */}
      <FloatingButtons  slug={propertyDetails?.property_website}/>
    </div>
  );
}

export default App;
