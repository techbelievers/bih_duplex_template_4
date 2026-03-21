import React, { useState, useEffect, useRef } from 'react';
import styles from './Gallery.module.css';
import { API } from '../../../../../config.js';

const RealEstateShowcase = ({slug}) => {
  const [galleryData, setGalleryData] = useState([]);
  const [videoData, setVideoData] = useState([]);
  const [galleryHeading, setGalleryHeading] = useState('');
  const [gallerySubheading, setGallerySubHeading] = useState('');
  const [videoHeading, setVideoHeading] = useState('');
  const [videoSubheading, setVideoSubHeading] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const videoRefs = useRef([]);

  // Fetch Gallery Data
  useEffect(() => {
    fetch(API.GALLERY_STUDIO(slug))
      .then((response) => response.json())
      .then((data) => {
        setGalleryData(data.property_photos || []);
        setGalleryHeading(data.page?.[0]?.heading || 'Gallery');
        setGallerySubHeading(data.page?.[0]?.subheading || 'Explore Stunning Properties');
      })
      .catch((error) => console.error('Error fetching gallery data:', error));
  }, [slug]);

  // Fetch Video Data
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(API.VIDEO_STUDIO(slug));
        const data = await response.json();
        setVideoData(data.property_videos || []);
        setVideoHeading(data.page?.heading || 'Video');
        setVideoSubHeading(data.page?.subheading || 'Experience Luxury Living');
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    fetchVideoData();
  }, [slug]);

  // Handle Modal for Gallery
  const openModal = (image) => setSelectedImage(image);
  const closeModal = () => setSelectedImage(null);

  // Intersection Observer for Video Autoplay
  useEffect(() => {
    const refs = videoRefs.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target.querySelector('iframe');
          if (entry.isIntersecting) {
            const src = videoElement.src;
            if (!src.includes('autoplay=1')) {
              videoElement.src = `${src}?autoplay=1&mute=1`;
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    refs.forEach((videoRef) => {
      if (videoRef) observer.observe(videoRef);
    });

    return () => {
      refs.forEach((videoRef) => {
        if (videoRef) observer.unobserve(videoRef);
      });
    };
  }, [videoData]);

  return (
    <div className={styles.showcaseContainer}>
      {/* Gallery Section */}
      <div id="gallery" className={styles.galleryContainer}>
        <span className={styles.label}>Gallery</span>
        <h2 className={styles.heading}>{galleryHeading}</h2>
        <p className={styles.subheading}>{gallerySubheading}</p>
        <div className={styles.galleryGrid}>
          {galleryData.map((photo) => (
            <div
              key={photo.id}
              className={styles.galleryItem}
              onClick={() => openModal(photo.photo)}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={photo.photo}
                  alt={`Property ${photo.property_id}`}
                  className={styles.image}
                />
                <div className={styles.clipOverlay}></div>
              </div>
              {photo.caption && <p className={styles.caption}>{photo.caption}</p>}
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent}>
            <img src={selectedImage} alt="Enlarged View" className={styles.modalImage} />
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Video Section */}
      {videoData.length > 0 && (
  <div id="video" className={styles.videoContainer}>
    <h2 className={styles.heading}>{videoHeading}</h2>
    <p className={styles.subheading}>{videoSubheading}</p>
    <div className={styles.videoWrapper}>
      {videoData.map((video, index) => (
        <div
          key={video.id}
          className={styles.videoItem}
          ref={(el) => (videoRefs.current[index] = el)}
        >
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${video.youtube_video_id}`}
            title="Property Video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  );
};

export default RealEstateShowcase;
