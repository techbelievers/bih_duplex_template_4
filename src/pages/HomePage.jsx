import React, { useState, useEffect, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { API, DEFAULT_DOMAIN } from "../../config.js";
import Loader from "../components/loader/Loader.jsx";
import FloatingButtons from "../components/template1/components/FloatingButtons.jsx";

// Lazy load Template1
const Template1 = lazy(() => import("../components/template1/App.jsx"));

const normalizeColorTheme = (val) => {
  const n = parseInt(val, 10);
  if (Number.isNaN(n) || n < 1) return 1;
  if (n > 16) return 16;
  return n;
};

const HomePage = () => {
  const [templateId, setTemplateId] = useState(null);
  const [colorTheme, setColorTheme] = useState(1);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const domain = DEFAULT_DOMAIN;
        
        // Fetch SEO data
        const seoResponse = await axios.get(API.SEO_DETAIL(domain));
        setSeoData(seoResponse.data);

        // Fetch template ID and color theme
        const templateResponse = await axios.get(API.TEMPLATE());
        const templateData = templateResponse.data || {};
        setTemplateId(templateData.templateId || '1');
        setColorTheme(normalizeColorTheme(templateData.color_theme ?? templateData.colorTheme ?? 1));

        // Fetch property details
        const propertyResponse = await axios.get(API.PROPERTY_DETAILS(domain));
        const propertyData = propertyResponse.data;
        
        if (propertyData && propertyData.property_details) {
          setPropertyDetails(propertyData.property_details);
        } else {
          setError('Property details not found.');
        }
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  const seo = seoData?.data || {};

  return (
    <>
      <Helmet>
        <title>{seo.title || 'Studio Apartments'}</title>
        <meta name="description" content={seo.meta_description || ''} />
        <meta name="keywords" content={seo.keywords || ''} />
        <meta property="og:title" content={seo.og_title || seo.title || ''} />
        <meta property="og:description" content={seo.og_description || seo.meta_description || ''} />
        <meta property="og:image" content={seo.og_image || ''} />
        <meta property="og:type" content={seo.og_type || 'website'} />
        {/* {seo.domain && <link rel="canonical" href={`https://${seo.domain}`} />} */}
        <meta name="robots" content={seo.status === 'Active' ? 'index, follow' : 'noindex, nofollow'} />
        {seo.favicon && <link rel="icon" href={seo.favicon} />}
      </Helmet>

      <main>
        <h1 className="hidden-h1">{seo.title || 'Studio Apartments'}</h1>
        <h2 className="hidden-h1">{seo.meta_description || ''}</h2>
        
        {templateId === '3' && (
          <Suspense fallback={<Loader />}>
            <Template1 propertyDetails={propertyDetails} colorTheme={colorTheme} />
          </Suspense>
        )}
        
        {templateId !== '3' && (
          <div>Template not found: {templateId}</div>
        )}
      </main>
      
      <FloatingButtons slug={propertyDetails?.property_website || DEFAULT_DOMAIN} />
    </>
  );
};

export default HomePage;

