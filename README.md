# Vasudha Pharma Chem Limited — Official Corporate Web Platform

[![Deploy to GitHub Pages](https://github.com/saikrishna-bethamcharla/vasudhapharma/actions/workflows/deploy.yml/badge.svg)](https://github.com/saikrishna-bethamcharla/vasudhapharma/actions/workflows/deploy.yml)

Live Production URL: **[https://saikrishna-bethamcharla.github.io/vasudhapharma/](https://saikrishna-bethamcharla.github.io/vasudhapharma/)**  
Staff Operations Portal: **[https://saikrishna-bethamcharla.github.io/vasudhapharma/staff/](https://saikrishna-bethamcharla.github.io/vasudhapharma/staff/)**

---

## Overview

Vasudha Pharma Chem Limited (VPCL) is a premier global manufacturer of Active Pharmaceutical Ingredients (APIs), Advanced Pharma Intermediates, Pellets & MUPS, and Piperidone Derivatives, serving regulated markets worldwide across USFDA, PMDA, EDQM, and WHO-GMP approved campuses.

This repository contains the complete enterprise website, interactive product catalog, multi-product RFQ cart system, digital compliance records, and the internal staff administration portal.

---

## Key Features

- **150+ Commercial Molecules**: Searchable catalogs across APIs, Intermediates, Pellets & MUPS, and Piperidone derivatives with 1-click CAS copying and molecule previews.
- **Dynamic B2B RFQ Cart**: Multi-product procurement cart allowing global buyers to batch-inquire commercial volumes directly into Zoho CRM.
- **Adaptive Contact System**: Department-specific dynamic forms routing inquiries to Marketing, Manufacturing/CDMO, R&D, Corporate Governance, and Careers.
- **Staff Operations Portal (/staff/)**: Internal console for managing news/events cards (with live 16:9 image uploading), open vacancies, statutory reports, and photo galleries.
- **Global Compliance & Legal**: DPDP Act compliant privacy policy, comprehensive cookie consent banner, branded 404 handler, XML sitemap, and search indexing rules.
- **Multilingual Support**: Dedicated Hindi portal pages (*-hi.html) with complete translated taxonomies.

---

## Deployment & Hosting

The site is configured for automated continuous deployment to **GitHub Pages** via GitHub Actions (.github/workflows/deploy.yml). Any push to main automatically triggers an artifact build and deploys the entire website within seconds.

---

## Repository Structure

\\\
vasudhapharma/
├── assets/                    # Optimized photography, certificates, icons, and logos
├── staff/                     # Internal staff administration portal
│   ├── index.html             # Console interface (News/Events, Careers, Compliance)
│   └── .htaccess              # Access restriction headers
├── .github/workflows/         # Automated GitHub Actions deployment
│   └── deploy.yml
├── news-events.json           # Live news updates, GPACTS 2026, and state awards
├── jobs.json                  # Active career openings dataset
├── foundation-galleries.json  # CSR & foundation photo galleries
├── index.html                 # Primary homepage
├── contact.html               # Adaptive contact & RFQ submission
├── privacy-policy.html        # DPDP compliance & privacy terms
├── sitemap.xml                # SEO canonical indexing sitemap
├── robots.txt                 # Search engine crawling rules
└── .nojekyll                  # Static asset bypass for GitHub Pages
\\\

---

&copy; 2026 Vasudha Pharma Chem Limited. All rights reserved.
