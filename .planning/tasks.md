# Project Task Management

This file tracks the current state of the portfolio development and pending optimizations. Use this as the "Source of Truth" for what needs to be done next.

## Status Legend
- `[ ]` Pending
- `[/]` In Progress
- `[x]` Completed
- `[!]` Critical / Blocked

## Current Phase: Production Readiness & Architectural Finalization

### Core Architecture
- [x] Consolidate Global Styles into `src/styles`
- [x] Enforce Feature-Based Colocation
- [x] Merge Providers into Unified `AppProvider`
- [x] Decouple Data Layer into `usePortfolioSync` hook
- [x] Implement "Instant Load" (Cached-first) logic

### Security & DevOps
- [x] Move hardcoded Firebase keys to `.env.local`
- [x] Clean up unused/legacy files (`check-colors.js`, etc.)
- [x] Standardize and secure `eslint.config.js`
- [x] Create Master Architecture Documentation

### UI/UX Refinements
- [x] Accessibility Pass: Added ARIA labels and semantic nav to MainContainer
- [/] Visual Audit: Initial check of colocation completed
- [ ] Performance Optimization: Audit Three.js/GSAP memory usage
- [ ] Contact Form Verification: Live test Nodemailer flow

### Backlog / Future Ideas
- [ ] Multi-language support (i18n)
- [ ] Dark/Light mode toggle (currently Dark only)
- [ ] Blog/Articles section synced with Firebase
