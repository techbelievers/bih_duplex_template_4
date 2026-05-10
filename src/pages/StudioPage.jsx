import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { API, DEFAULT_DOMAIN } from "../../config.js";
import Loader from "../components/loader/Loader.jsx";
import Template1 from "../components/template1/StudioTemplate.jsx";

const normalizeColorTheme = (val) => {
  const n = parseInt(val, 10);
  if (Number.isNaN(n) || n < 1) return 1;
  if (n > 16) return 16;
  return n;
};

const StudioPage = () => {
  const { property_slug } = useParams();
  const [templateId, setTemplateId] = useState(null);
  const [colorTheme, setColorTheme] = useState(1);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [headerData, setHeaderData] = useState(null);
  const [seoData, setSeoData] = useState(null);
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!property_slug) {
        setError('Property slug is required');
        setLoading(false);
        return;
      }

      try {
        const domain = DEFAULT_DOMAIN;

        // Fetch Template ID and color theme
        const templateResponse = await axios.get(API.TEMPLATE_STUDIO(domain));
        const templateData = templateResponse.data || {};
        setTemplateId(templateData.templateId || '1');
        setColorTheme(normalizeColorTheme(templateData.color_theme ?? templateData.colorTheme ?? 1));

        // Fetch Property Details
        const propertyResponse = await axios.get(
          API.PROPERTY_DETAILS_STUDIO(domain, property_slug)
        );
        setPropertyDetails(propertyResponse.data?.property_details || null);

        // Fetch SEO Data (for studio pages)
        const seoResponse = await axios.get(
          API.SEO_DETAIL_STUDIO(domain, property_slug)
        );
        setSeoData(seoResponse.data);

        // Fetch Header Data
        const headerResponse = await axios.get(
          API.HEADER_STUDIO(domain, property_slug)
        );
        setHeaderData(headerResponse.data || null);

        // Fetch Gallery Data
        const galleryResponse = await axios.get(
          API.GALLERY_STUDIO(property_slug)
        );
        const gallery_photos = galleryResponse.data?.property_photos || [];
        setGalleryData(Array.isArray(gallery_photos) ? gallery_photos : []);
      } catch (err) {
        console.error('Error fetching data:', err.message);
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [property_slug]);

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;
  if (!propertyDetails || !propertyDetails.property_slug) {
    return <div>Error: Property details are missing or invalid.</div>;
  }

  // Use SEO data, fallback to headerData, then propertyDetails
  const seo = seoData?.data || headerData?.data || {};

  // Prepare SEO values with proper fallbacks
  const title = seo.title || propertyDetails.property_name || 'Studio Property';
  const description = seo.meta_description || propertyDetails.seo_meta_description || propertyDetails.property_description || '';
  const keywords = seo.keywords || propertyDetails.keywords || '';
  const ogTitle = seo.og_title || seo.title || propertyDetails.property_name || '';
  const ogDescription = seo.og_description || seo.meta_description || propertyDetails.seo_meta_description || propertyDetails.property_description || '';
  const ogImage = seo.og_image || propertyDetails.property_photo || propertyDetails.property_image || '';
  const canonicalUrl = `https://${seo.domain || DEFAULT_DOMAIN}/${property_slug}`;

  return (
    <>
      <Helmet
        defer={false}
        prioritizeSeoTags={true}
      >
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:type" content={seo.og_type || 'website'} />
        <meta property="og:url" content={canonicalUrl} />
        {/* <link rel="canonical" href={canonicalUrl} /> */}
        <meta name="robots" content={seo.status === 'Active' ? 'index, follow' : 'index, follow'} />
        {seo.favicon && <link rel="icon" href={seo.favicon} />}
        
        {/* JSON-LD Structured Data */}
        {seo.script_1 && seo.script_1 !== '{}' && (
          <script type="application/ld+json">
            {typeof seo.script_1 === 'string' ? seo.script_1 : JSON.stringify(seo.script_1)}
          </script>
        )}
        {seo.script_2 && seo.script_2 !== '{}' && (
          <script type="application/ld+json">
            {typeof seo.script_2 === 'string' ? seo.script_2 : JSON.stringify(seo.script_2)}
          </script>
        )}
      </Helmet>

      <main>
        {/* <h1 className="hidden-h1">{seo.title || propertyDetails.property_name || 'Studio Property'}</h1>
        <h2 className="hidden-h1">{seo.meta_description || propertyDetails.seo_meta_description || propertyDetails.property_description || ''}</h2> */}
        
        {templateId === '4' && (
          <Suspense fallback={<Loader />}>
            <Template1
              propertyDetails={propertyDetails}
              headerData={headerData}
              galleryData={galleryData}
              colorTheme={colorTheme}
            />
          </Suspense>
        )}
        
        {templateId !== '4' && (
          <div>Template not found: {templateId}</div>
        )}
      </main>
    </>
  );
};

export default StudioPage;

