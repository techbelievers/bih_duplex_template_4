import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { API, DEFAULT_DOMAIN } from '../../config.js';
import styles from '../pages/blogs/BlogDetail.module.css';
import Loader from './loader/Loader.jsx';

const BlogContent = () => {
  const { post_slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!post_slug) {
        setError('Blog slug is required');
        setLoading(false);
        return;
      }

      try {
        const domain = DEFAULT_DOMAIN;
        const response = await fetch(API.BLOGS_DETAIL(post_slug, domain));
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog details');
        }
        
        const data = await response.json();
        const foundBlog = data.blogs?.find((b) => b.post_slug === post_slug);

        if (!foundBlog) {
          setError('Blog not found');
        } else {
          setBlog(foundBlog);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [post_slug]);

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <>
      <Helmet>
        <title>{blog.post_title || 'Blog Post'}</title>
        <meta name="description" content={blog.post_content?.substring(0, 160) || ''} />
        <meta property="og:title" content={blog.post_title || ''} />
        <meta property="og:description" content={blog.post_content?.substring(0, 160) || ''} />
        <meta property="og:image" content={blog.post_photo || ''} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className={styles.blogDetailContainer}>
        <div className={styles.blogHeader}>
          <h1 className={styles.blogTitle}>{blog.post_title}</h1>
          <p className={styles.postDate}>
            Posted On: {new Date(blog.created_at).toISOString().split('T')[0]}
          </p>
        </div>

        <div className={styles.imageWrapper}>
          <img src={blog.post_photo} alt={blog.post_title} className={styles.blogImage} />
        </div>

        <div className={styles.blogContent}>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: blog.post_content }}
          />
        </div>

        <Link to="/" className={styles.backLink}>
          Back to Blogs
        </Link>
      </div>
    </>
  );
};

export default BlogContent;

