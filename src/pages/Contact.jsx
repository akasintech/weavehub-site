import React, { useState, useEffect } from "react";
import { updateSEO } from "../utils/seo";
import { Mail, MessageCircle, Clock, Send, CheckCircle2, ChevronDown } from "lucide-react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "general",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    updateSEO({
      title: "Contact & Support – WeaveHub",
      description: "Get help with WeaveHub. Contact our team, browse FAQs, or submit an inquiry.",
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", type: "general", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 6000);
    }, 1000);
  };

  return (
    <>
      <section className="page-hero" aria-labelledby="contact-heading">
        <div className="container">
          <div className="page-hero-content">
            <div className="page-hero-icon" aria-hidden="true">
              <Mail size={32} />
            </div>
            <h1 id="contact-heading" className="page-hero-title">
              Contact &amp; Support
            </h1>
            <p className="page-hero-subtitle">
              Have questions about artisan orders, vendor registration, or the mobile app? We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Channels Grid */}
      <section className="section" aria-labelledby="channels-heading">
        <div className="container">
          <div className="channels-grid" style={{ marginBottom: "56px" }}>
            <div className="channel-card">
              <div className="channel-icon">
                <Mail size={24} />
              </div>
              <h3 className="channel-title">Email Inquiries</h3>
              <p className="channel-desc">Our dedicated support desk replies within 24 business hours.</p>
              <a href="mailto:hello@weavehub.io" className="channel-action">
                hello@weavehub.io →
              </a>
            </div>

            <div className="channel-card channel-card--featured">
              <span className="channel-badge">Recommended</span>
              <div className="channel-icon">
                <MessageCircle size={24} />
              </div>
              <h3 className="channel-title">In-App Live Chat</h3>
              <p className="channel-desc">Get instant answers and real-time order support directly in the app.</p>
              <a href="/download" className="channel-action--btn">
                Open WeaveHub
              </a>
            </div>

            <div className="channel-card">
              <div className="channel-icon">
                <Clock size={24} />
              </div>
              <h3 className="channel-title">Support Hours</h3>
              <p className="channel-desc">Monday – Saturday: 8:00 AM – 7:00 PM (WAT)</p>
              <span className="channel-action" style={{ color: "var(--primary-dark)" }}>
                Active &amp; Online
              </span>
            </div>
          </div>

          {/* Form & Info */}
          <div className="form-layout" style={{ marginBottom: "64px" }}>
            <div className="form-info">
              <h2 className="section-title" style={{ fontSize: "28px", marginBottom: "12px" }}>
                Send Us a Message
              </h2>
              <p className="form-info-desc">
                Fill out the inquiry form and our team will get back to you with guidance and technical assistance.
              </p>

              <div className="form-hours">
                <div className="form-hours-item">
                  <div className="form-hours-icon">
                    <Mail size={18} />
                  </div>
                  <div>
                    <strong>Vendor Onboarding</strong>
                    <p>vendors@weavehub.io</p>
                  </div>
                </div>

                <div className="form-hours-item">
                  <div className="form-hours-icon">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <strong>Customer Protection</strong>
                    <p>support@weavehub.io</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="support-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    id="contact-name"
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Amara Okafor"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    id="contact-email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="you@domain.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-type">
                  Topic / Issue Type
                </label>
                <select
                  id="contact-type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="form-input form-select"
                >
                  <option value="general">General Marketplace Inquiry</option>
                  <option value="order">Order &amp; Delivery Question</option>
                  <option value="vendor">Vendor Storefront Setup</option>
                  <option value="wallet">Wallet &amp; Payment Support</option>
                  <option value="technical">App Issue / Bug Report</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">
                  Subject <span className="required">*</span>
                </label>
                <input
                  id="contact-subject"
                  required
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="form-input"
                  placeholder="Brief summary of your inquiry"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">
                  Message Details <span className="required">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-input form-textarea"
                  placeholder="Tell us how we can assist you..."
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary btn-block">
                <Send size={16} />
                <span>{loading ? "Sending..." : "Submit Inquiry"}</span>
              </button>

              {submitted && (
                <div className="form-success">
                  <CheckCircle2 size={18} />
                  <span>Thank you! Your message has been received. We'll reply shortly.</span>
                </div>
              )}
            </form>
          </div>

          {/* Frequently Asked Questions */}
          <div className="section-header" style={{ marginBottom: "32px" }}>
            <div className="section-badge">FAQ</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>

          <div className="faq-grid">
            <details className="faq-item">
              <summary className="faq-question">
                <span>How do I purchase products seen on this website?</span>
                <ChevronDown className="icon" />
              </summary>
              <div className="faq-answer">
                <p>
                  Every product page features a prominent "Buy on WeaveHub" button. On mobile devices, clicking it will deep-link directly to that item in the WeaveHub app. On desktop, a QR code appears so you can scan and open it instantly on your phone.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                <span>Are all vendors and items verified?</span>
                <ChevronDown className="icon" />
              </summary>
              <div className="faq-answer">
                <p>
                  Yes. WeaveHub verifies artisan seller profiles, shop identity, and craft authenticity before enabling live storefronts and buyer payments.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                <span>How does live shopping work?</span>
                <ChevronDown className="icon" />
              </summary>
              <div className="faq-answer">
                <p>
                  Artisan creators host real-time broadcasts in the mobile app. You can chat with the seller, request close-up looks at crafts, and purchase highlighted items during the stream.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                <span>How can I register my own artisan store?</span>
                <ChevronDown className="icon" />
              </summary>
              <div className="faq-answer">
                <p>
                  Download the WeaveHub app, tap "Register as Vendor", and complete your shop profile with logo, banner, and bank disbursement details. You can begin publishing products within minutes!
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
