import React, { lazy, Suspense } from 'react';
import Header from './components/Header';
import HeroBanner from './detail-components/HeroBanner/HeroBanner';
import Returns from './detail-components/returns/know-your-returns';
import Footer from './components/Footer';
import PropertyPriceTable from './detail-components/property-price/PropertyPriceTable';
import MasterPlan from './detail-components/plans/MasterPlan';
import Advertise from './detail-components/advertise/Advertisements';
import Amenities from './detail-components/amenities/Amenities';
import Gallery from './detail-components/gallery/Gallery';
import LocationMap from './detail-components/location/LocationMap';
import FloatingButtons from './components/FloatingButtons';
import Loader from '../loader/Loader';

// Dynamically import PropertyDetails
const PropertyDetails = lazy(() => import('./detail-components/property-details/PropertyDetails'));
const MahareraInformation = lazy(() => import('./detail-components/Maharera/MahaReraInformation'));

function StudioTemplate({ propertyDetails, headerData, galleryData, colorTheme = 1 }) {
  if (!propertyDetails || !propertyDetails.property_slug) {
    return <div>Error: Property details are missing or invalid.</div>;
  }

  const themeClass = `theme-${Math.min(16, Math.max(1, Number(colorTheme) || 1))}`;
  return (
    <div className={`App theme-redesign ${themeClass}`}>
      <Header 
        headerData={headerData} 
        slug={propertyDetails.property_slug}
      />
      <HeroBanner
        propertyDetails={propertyDetails}
        slug={propertyDetails.property_slug}
        galleryData={galleryData}
        servicesData={headerData}
      />
      <Suspense fallback={<Loader />}>
        <MahareraInformation 
          propertyDetails={propertyDetails} 
          slug={propertyDetails.property_slug} 
        />
      </Suspense>
      <PropertyPriceTable slug={propertyDetails.property_slug} />
      <MasterPlan slug={propertyDetails.property_slug} />
      <Returns slug={propertyDetails.property_slug}/>
      <Suspense fallback={<Loader />}>
        <PropertyDetails propertyDetails={propertyDetails} />
      </Suspense>
      <Advertise slug={propertyDetails.property_slug}/>
      <Amenities slug={propertyDetails.property_slug} />
      <Gallery slug={propertyDetails.property_slug} />
      <LocationMap slug={propertyDetails.property_slug} />
      <Footer />
      <FloatingButtons slug={propertyDetails.property_slug} />
    </div>
  );
}

export default StudioTemplate;

