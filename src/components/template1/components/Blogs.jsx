import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API } from "../../../../config.js";
import styles from "../css/Blogs.module.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [shown, setShown] = useState(3);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");

  useEffect(() => {
    fetch(API.BLOGS())
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.blogs || []);
        setHeading(data.blog_page?.name || "Blogs");
        setSubheading(data.blog_page?.detail || "");
      })
      .catch(console.error);
  }, []);

  if (!blogs.length) return null;

  const [featured, ...rest] = blogs;
  const hasMore = rest.length > 0 && shown - 1 < rest.length;

  return (
    <section id="blogs" className={styles.section}>
      <div className={styles.head}>
        <span className={styles.label}>Insights</span>
        <h2 className={styles.title}>{heading}</h2>
        {subheading && <p className={styles.sub}>{subheading}</p>}
      </div>

      {/* Featured: horizontal card (image left, content right) */}
      <div className={styles.featured}>
        <article className={styles.featuredCard}>
          <Link to={`/blogs/${featured.post_slug}`} className={styles.featuredLink}>
            <div className={styles.featuredImage}>
              <img src={featured.post_photo} alt={featured.post_title} className={styles.featuredImg} />
            </div>
            <div className={styles.featuredBody}>
              <h3 className={styles.featuredTitle}>{featured.post_title}</h3>
              <p className={styles.featuredExcerpt}>
                {(featured.post_content_short || "").slice(0, 140)}…
              </p>
              <span className={styles.featuredCta}>Read article</span>
            </div>
          </Link>
        </article>
      </div>

      {/* Grid of remaining posts */}
      {rest.length > 0 && (
        <div className={styles.grid}>
          {rest.slice(0, Math.max(0, shown - 1)).map((blog) => (
            <article key={blog.post_slug} className={styles.card}>
              <Link to={`/blogs/${blog.post_slug}`} className={styles.link}>
                <div className={styles.imgWrap}>
                  <img src={blog.post_photo} alt={blog.post_title} className={styles.img} />
                </div>
                <div className={styles.body}>
                  <h3 className={styles.cardTitle}>{blog.post_title}</h3>
                  <p className={styles.excerpt}>
                    {(blog.post_content_short || "").slice(0, 80)}…
                  </p>
                  <span className={styles.more}>Read more</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

      {hasMore && (
        <div className={styles.moreWrap}>
          <button type="button" className={styles.moreBtn} onClick={() => setShown((s) => s + 3)}>
            Load more
          </button>
        </div>
      )}
    </section>
  );
};

export default Blogs;
