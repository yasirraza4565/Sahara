import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About Sahara</h1>
        <p>Your trusted source for quality and value since 2025.</p>
      </header>

      <section className="about-section mission">
        <h2>Our Mission</h2>
        <p>
          At **Sahara**, our mission is simple: to bring a curated selection of high-quality products directly to you, eliminating unnecessary middlemen and costs. We believe that everyone deserves access to great products at fair prices. We are committed to an excellent online shopping experience, from browsing to checkout and beyond.
        </p>
      </section>

      <section className="about-section values">
        <h2>Our Core Values</h2>
        <div className="value-cards">
          <div className="card-value">
            <h3>Quality First</h3>
            <p>Every product we list is carefully vetted for quality and durability, ensuring you get the best value for your money.</p>
          </div>
          <div className="card-value">
            <h3>Customer Focus</h3>
            <p>Our customers are at the heart of everything we do. We strive to provide fast support and a hassle-free return policy.</p>
          </div>
          <div className="card-value">
            <h3>Transparency</h3>
            <p>We believe in honest pricing, clear descriptions, and straightforward policies with no hidden fees.</p>
          </div>
        </div>
      </section>

      <section className="about-section journey">
        <h2>The MyShop Journey</h2>
        <p>
          Founded in 2024, MyShop started as a small idea to make online shopping simpler and more reliable. We've grown rapidly, constantly adding new products and features, but our commitment to our founding principles remains strong. We leverage modern technology to ensure your data is secure and your shipping is prompt. Thank you for being a part of our journey!
        </p>
      </section>
      
      <section className="about-section call-to-action">
        <p>Ready to discover your next favorite product?</p>
        <a href="/products" className="shop-link-btn">Start Shopping Now</a>
      </section>
    </div>
  );
};

export default About;