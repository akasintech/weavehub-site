import React, { useEffect } from "react";
import { updateSEO } from "../utils/seo";
import { Shield, Lock, FileText, Mail, Info, CheckCircle2 } from "lucide-react";

export function Privacy() {
  useEffect(() => {
    updateSEO({
      title: "Privacy Policy – WeaveHub",
      description:
        "Read WeaveHub's Privacy Policy to understand how we collect, use, and protect your personal data.",
    });
  }, []);

  return (
    <>
      <section className="page-hero" aria-labelledby="privacy-heading">
        <div className="container">
          <div className="page-hero-content">
            <div className="page-hero-icon" aria-hidden="true">
              <Shield size={32} />
            </div>
            <h1 id="privacy-heading" className="page-hero-title">
              Privacy Policy
            </h1>
            <p className="page-hero-subtitle">
              We are committed to keeping your personal data safe and being transparent about how we use it.
            </p>
            <div className="page-hero-meta">
              <span className="meta-badge">Last updated: July 2026</span>
              <span className="meta-badge meta-badge--green">v1.0 Official</span>
            </div>
          </div>
        </div>
      </section>

      <section className="privacy-section" aria-label="Privacy Policy Content">
        <div className="container privacy-container">
          {/* Sidebar TOC */}
          <nav className="privacy-toc" aria-label="Privacy policy table of contents">
            <div className="toc-title">Contents</div>
            <ul className="toc-list" role="list">
              <li><a href="#pp-intro" className="toc-link">1. Introduction</a></li>
              <li><a href="#pp-collect" className="toc-link">2. Information We Collect</a></li>
              <li><a href="#pp-use" className="toc-link">3. How We Use Data</a></li>
              <li><a href="#pp-share" className="toc-link">4. Data Sharing</a></li>
              <li><a href="#pp-storage" className="toc-link">5. Security &amp; Storage</a></li>
              <li><a href="#pp-rights" className="toc-link">6. Your Rights</a></li>
              <li><a href="#pp-contact" className="toc-link">7. Contact Us</a></li>
            </ul>
          </nav>

          {/* Policy Content */}
          <div className="privacy-body">
            <div className="privacy-alert">
              <Info className="privacy-alert-icon" size={20} />
              <p>
                <strong>Summary for Quick Reading:</strong> WeaveHub values your trust. We collect basic account and purchase information to operate the marketplace, process payments, and connect buyers with artisan creators. We never sell your personal information to advertisers.
              </p>
            </div>

            <article className="pp-section" id="pp-intro">
              <div className="pp-section-header">
                <div className="pp-icon-wrap"><FileText size={18} /></div>
                <h2 className="pp-section-title">1. Introduction</h2>
              </div>
              <div className="pp-section-body">
                <p>
                  Welcome to WeaveHub ("WeaveHub," "we," "us," or "our"). This Privacy Policy explains how Weavehub Technologies Ltd. collects, uses, discloses, and protects your information when you use the WeaveHub website, mobile application, and related services (collectively, the "Platform").
                </p>
                <p>
                  By creating an account, browsing products, or accessing our services, you agree to the collection and use of information in accordance with this policy.
                </p>
              </div>
            </article>

            <article className="pp-section" id="pp-collect">
              <div className="pp-section-header">
                <div className="pp-icon-wrap"><Lock size={18} /></div>
                <h2 className="pp-section-title">2. Information We Collect</h2>
              </div>
              <div className="pp-section-body">
                <p>We collect information in the following ways:</p>
                <ul className="pp-list">
                  <li><strong>Account Information:</strong> Name, email address, phone number, and password when you register.</li>
                  <li><strong>Vendor Information:</strong> Business registration, artisan store details, bank account details, and verification documents.</li>
                  <li><strong>Transaction Details:</strong> Orders, delivery addresses, and payment references (processed securely via authorized payment gateways).</li>
                  <li><strong>Communications:</strong> In-app chats between buyers and vendors, comments, and customer support inquiries.</li>
                  <li><strong>Device and Usage Information:</strong> IP address, device model, operating system, and anonymous usage telemetry.</li>
                </ul>
              </div>
            </article>

            <article className="pp-section" id="pp-use">
              <div className="pp-section-header">
                <div className="pp-icon-wrap"><CheckCircle2 size={18} /></div>
                <h2 className="pp-section-title">3. How We Use Your Information</h2>
              </div>
              <div className="pp-section-body">
                <p>We use your information to:</p>
                <ul className="pp-list">
                  <li>Operate, maintain, and enhance the WeaveHub marketplace storefront.</li>
                  <li>Facilitate order processing, escrow payments, and delivery tracking.</li>
                  <li>Connect buyers directly with independent artisans through live shopping and messaging.</li>
                  <li>Protect against fraudulent activities and enforce our Terms of Service.</li>
                  <li>Send critical order confirmations, shipping updates, and service notifications.</li>
                </ul>
              </div>
            </article>

            <article className="pp-section" id="pp-share">
              <div className="pp-section-header">
                <div className="pp-icon-wrap"><Shield size={18} /></div>
                <h2 className="pp-section-title">4. Sharing Your Information</h2>
              </div>
              <div className="pp-section-body">
                <p>
                  We share personal information strictly as necessary to fulfill marketplace transactions:
                </p>
                <ul className="pp-list">
                  <li><strong>With Vendors:</strong> When you make a purchase, the vendor receives your shipping address and name to fulfill the order.</li>
                  <li><strong>With Logistics Partners:</strong> Delivery carriers receive parcel address information.</li>
                  <li><strong>Payment Processors:</strong> Encrypted transaction data is routed through certified PCI-DSS payment gateways.</li>
                  <li><strong>Legal Compliance:</strong> If required by law, regulation, or court order.</li>
                </ul>
              </div>
            </article>

            <article className="pp-section" id="pp-storage">
              <div className="pp-section-header">
                <div className="pp-icon-wrap"><Lock size={18} /></div>
                <h2 className="pp-section-title">5. Data Storage &amp; Security</h2>
              </div>
              <div className="pp-section-body">
                <p>
                  We implement robust industry-standard technical safeguards including SSL/TLS encryption for all data in transit, encrypted storage, and access controls. However, no electronic transmission over the Internet can be guaranteed 100% secure.
                </p>
              </div>
            </article>

            <article className="pp-section" id="pp-rights">
              <div className="pp-section-header">
                <div className="pp-icon-wrap"><Shield size={18} /></div>
                <h2 className="pp-section-title">6. Your Rights</h2>
              </div>
              <div className="pp-section-body">
                <p>
                  Depending on your jurisdiction, you have the right to access, rectify, or request deletion of your personal data. You may update your profile directly inside the WeaveHub app settings or reach out to our privacy officer.
                </p>
              </div>
            </article>

            <article className="pp-section" id="pp-contact">
              <div className="pp-section-header">
                <div className="pp-icon-wrap"><Mail size={18} /></div>
                <h2 className="pp-section-title">7. Contact Us</h2>
              </div>
              <div className="pp-section-body">
                <p>If you have any questions or concerns regarding this Privacy Policy:</p>
                <div className="contact-info-grid">
                  <a href="mailto:privacy@weavehub.io" className="contact-info-card">
                    <Mail size={16} />
                    <span>privacy@weavehub.io</span>
                  </a>
                  <a href="mailto:hello@weavehub.io" className="contact-info-card">
                    <Mail size={16} />
                    <span>hello@weavehub.io</span>
                  </a>
                </div>
              </div>
            </article>

            <div className="pp-footer-note">
              Weavehub Technologies Ltd. · Lagos, Nigeria · All Rights Reserved
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
