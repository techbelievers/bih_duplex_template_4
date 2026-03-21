/**
 * Custom prerender script using Puppeteer
 * Generates static HTML files for all routes at build time
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  SLUG_URL: process.env.VITE_SLUG_URL || "studioapartmentsinpune.com",
  API_URL: process.env.VITE_API_URL || "https://www.buyindiahomes.in/api",
};

async function fetchStudioRoutes() {
  try {
    const response = await fetch(`${config.API_URL}/get-properties?website=${config.SLUG_URL}`);
    if (response.ok) {
      const data = await response.json();
      const properties = data.property_details || [];
      return properties
        .filter(prop => prop.property_slug && !prop.property_slug.includes('.com'))
        .map(prop => `/${prop.property_slug}`);
    }
  } catch (error) {
    console.warn('Could not fetch studio routes:', error.message);
  }
  return [];
}

async function fetchBlogRoutes() {
  try {
    const response = await fetch(`${config.API_URL}/blogs?website=${config.SLUG_URL}`);
    if (response.ok) {
      const data = await response.json();
      const blogs = data.blogs || [];
      return blogs.map(blog => `/blogs/${blog.post_slug || blog.id}`);
    }
  } catch (error) {
    console.warn('Could not fetch blog routes:', error.message);
  }
  return [];
}

async function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch {
      // Server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
}

async function prerender() {
  console.log('Starting prerendering...');
  
  const staticRoutes = ['/', '/privacy-policy', '/thank-you'];
  const studioRoutes = await fetchStudioRoutes();
  const blogRoutes = await fetchBlogRoutes();
  const allRoutes = [...staticRoutes, ...studioRoutes, ...blogRoutes];
  
  console.log(`Prerendering ${allRoutes.length} routes:`);
  console.log(`  - Static: ${staticRoutes.length}`);
  console.log(`  - Studios: ${studioRoutes.length}`);
  console.log(`  - Blogs: ${blogRoutes.length}`);
  
  const distPath = path.join(__dirname, '../dist');
  
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('dist/index.html not found. Run "npm run build" first.');
  }
  
  console.log('Starting preview server...');
  const serverProcess = spawn('npx', ['vite', 'preview', '--port', '4173', '--host'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe',
    detached: false
  });
  
  let serverReady = false;
  
  try {
    serverReady = await waitForServer('http://localhost:4173');
    
    if (!serverReady) {
      throw new Error('Preview server failed to start after 30 seconds');
    }
    
    console.log('✓ Preview server started');
    
    const baseUrl = 'http://localhost:4173';
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const failedRoutes = [];
    
    for (const route of allRoutes) {
      let page = null;
      try {
        console.log(`Prerendering: ${route}`);
        
        page = await browser.newPage();
        
        try {
          await page.goto(`${baseUrl}${route}`, {
            waitUntil: 'networkidle0',
            timeout: 60000
          });
        } catch (gotoError) {
          console.warn(`Warning: Navigation failed for ${route}, retrying...`);
          try {
            await page.close();
          } catch {}
          page = await browser.newPage();
          await page.goto(`${baseUrl}${route}`, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
          });
        }
        
        // Wait for all content to load
        await new Promise(resolve => setTimeout(resolve, 7000));
        
        // Wait for lazy-loaded components
        try {
          await page.evaluate(() => {
            return new Promise((resolve) => {
              const checkComponents = setInterval(() => {
                const suspenseElements = document.querySelectorAll('[data-suspense]');
                if (suspenseElements.length === 0) {
                  clearInterval(checkComponents);
                  resolve();
                }
              }, 100);
              
              setTimeout(() => {
                clearInterval(checkComponents);
                resolve();
              }, 3000);
            });
          });
        } catch (e) {
          // Ignore detached frame errors - page may have navigated
          console.warn(`Warning during evaluate for ${route}:`, e.message);
        }
        
        // Clean up duplicate meta tags - remove initial template tags, keep React Helmet tags
        try {
          await page.evaluate(() => {
            // Remove initial template meta tags (those without data-rh attribute)
            const head = document.head;
            const metaTags = head.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], link[rel="canonical"]');
            metaTags.forEach(tag => {
              if (!tag.hasAttribute('data-rh')) {
                tag.remove();
              }
            });
            
            // Remove initial title if React Helmet title exists
            const helmetTitle = head.querySelector('title[data-rh="true"]');
            const initialTitle = head.querySelector('title:not([data-rh])');
            if (helmetTitle && initialTitle) {
              initialTitle.remove();
            }
            
            // Remove initial JSON-LD scripts if React Helmet ones exist
            const helmetScripts = head.querySelectorAll('script[type="application/ld+json"][data-rh="true"]');
            if (helmetScripts.length > 0) {
              const initialScripts = head.querySelectorAll('script[type="application/ld+json"]:not([data-rh])');
              initialScripts.forEach(script => script.remove());
            }
          });
        } catch (e) {
          console.warn(`Warning during meta tag cleanup for ${route}:`, e.message);
        }
        
        let html;
        try {
          html = await page.content();
        } catch (e) {
          console.warn(`Warning: Could not get content for ${route}`);
          failedRoutes.push(route);
          try {
            await page.close();
          } catch {}
          continue;
        }
        
        let outputPath;
        if (route === '/') {
          outputPath = path.join(distPath, 'index.html');
        } else {
          const routePath = route.replace(/^\//, '').replace(/\/$/, '');
          const dirPath = path.join(distPath, routePath);
          
          fs.mkdirSync(dirPath, { recursive: true });
          outputPath = path.join(dirPath, 'index.html');
        }
        
        fs.writeFileSync(outputPath, html);
        console.log(`✓ Prerendered: ${route} -> ${outputPath}`);
        
      } catch (error) {
        console.error(`Error prerendering ${route}:`, error.message);
        failedRoutes.push(route);
      } finally {
        try {
          if (page) {
            await page.close();
          }
        } catch (e) {
          // Page may already be closed
        }
      }
    }
    
    await browser.close();
    
    if (failedRoutes.length > 0) {
      console.warn(`\n⚠ Warning: ${failedRoutes.length} routes failed to prerender:`);
      failedRoutes.forEach(route => console.warn(`  - ${route}`));
      console.log('\n✓ Prerendering complete (with some failures)');
    } else {
      console.log('✓ Prerendering complete!');
    }
  } catch (error) {
    console.error('Prerender error:', error);
    throw error;
  } finally {
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
      try {
        const { exec } = await import('child_process');
        exec('pkill -f "vite preview"', () => {});
      } catch {}
    }
  }
}

prerender().catch(error => {
  console.error('Prerender failed:', error);
  process.exit(1);
});

