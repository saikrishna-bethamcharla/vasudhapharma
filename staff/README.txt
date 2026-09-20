Vasudha Operations Portal (Staff Intranet)
===========================================

Access URL: https://YOURHOST/staff/
(Internal tool - do not link from public website header)

Initial Default Accounts:
  admin@vasudha.local    ChangeMe!   (Full Administrator: all desks + Users)
  hr@vasudha.local       ChangeMe!   (Careers / HR desk only)

* Note: Staff can change their own password anytime under "My Account" (profile.php).

Available Department Desks:
  1. Careers / HR (jobs.php)
     - Manage active and archived requisitions (jobs.json)
     - Live search, requisition cloning, candidate keywords
     - Publicly wired to careers.html

  2. News & Events (news.php)
     - Global conferences, exhibitions, booth locations (news-events.json)
     - Press releases, credit ratings, and sustainability updates
     - Image uploads to assets/news-events/

  3. Foundation (foundation.php)
     - Photo gallery stream manager for Vasudha Foundation, VRRV Family Foundation, and Moments
     - CSR initiatives and community programs
     - Image uploads to assets/foundation/ and assets/founder-gallery/

  4. Marketing (marketing.php)
     - Product catalogue working registry: APIs, Intermediates, Pellets, Pipeline
     - CAS numbers, therapeutic categories, DMF regulatory status

  5. Operations Desks (desk.php?d=...)
     - Manufacturing, R&D, EHS, Corporate Governance
     - Plant notes, equipment metrics, compliance links, last-updated tracking

  6. User Management (users.php) [Admin only]
     - Create and manage department-level staff logins
     - Assign granular desk permissions

Server Requirements & Permissions:
  - PHP 7.4+ or PHP 8.x with session support
  - Writable file permissions:
      jobs.json
      news-events.json
      foundation-galleries.json
      staff/data/*.json
      assets/foundation/
      assets/news-events/
      assets/founder-gallery/
