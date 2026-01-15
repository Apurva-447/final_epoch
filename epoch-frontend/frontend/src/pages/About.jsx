import React from "react";
import "./About.css";

const About = () => {
  return (
        
<section className="about-section" id="about">
  <div className="about-container">
    
    <div className="about-image">
      <img
        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
        alt="About EPOCH"
      />
    </div>

    <div className="about-content">
      <h2>About EPOCH</h2>

      <p>
        <strong>EPOCH</strong> is a modern event management platform built to
        transform the way people discover, attend, and manage events. From
        college fests and concerts to workshops and conferences, EPOCH brings
        everything together in one seamless experience.
      </p>

      <p>
        Our platform allows users to explore live events, view schedules, check
        seat availability, and book tickets securely — all in just a few clicks.
        We focus on speed, simplicity, and reliability to ensure a smooth
        journey for every user.
      </p>

      <p>
        For organizers, EPOCH offers powerful tools to create events, manage
        bookings, track attendance, and monitor event performance through a
        dedicated dashboard.
      </p>

      <div className="about-stats">
        <div>
          <h3>500+</h3>
          <span>Events Hosted</span>
        </div>
        <div>
          <h3>10K+</h3>
          <span>Happy Users</span>
        </div>
        <div>
          <h3>50+</h3>
          <span>Organizers</span>
        </div>
      </div>
    </div>

  </div>
</section>

  );
};

export default About;