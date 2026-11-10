# PLAN — GharDekho 🏠

_Last updated: 2026-11-10_

## 1. Goal & Success Criteria
- **What it is:** India's mobile-first rental marketplace connecting property owners with students and working professionals seeking rooms, PGs, shared accommodations, and studios.
- **Who it's for:** Students & young professionals relocating to new Indian cities, and property owners/landlords seeking verified, responsible tenants.
- **Core job to nail:** Let a student arriving in a new city find, inspect, and verify an affordable room (with transparent water timing, backup, sharing costs, and exact map location) in under 10 minutes.
- **Success looks like:** Tenant searches with filters & sees map pins in <2s; Owner lists full room in <5 steps; zero hidden surprises on arrival.

## 2. Research Notes
- **OYO:** Geared towards hotel/short stays; completely fails long-term students and split sharing.
- **NoBroker:** Good for unfurnished family flats; poor student PG focus, lacks amenity verification (Jal timing, inverter).
- **Unique Value Proposition:**
  - Split-room sharing engine (1/2/3/4 sharing with live slot tracking and per-head pricing)
  - Indian-specific amenity verification (Water timing, Inverter backup, Common/Attached bathroom, Tiffin availability)
  - Google Maps integration with nearby amenities (Metro, Hospital, Market, Swiggy delivery radius)

## 3. Users & Core Flows
1. **Tenant Discovery Flow:** Onboarding → Phone OTP → Set City & Budget → Map/Feed View → Filter by Sharing/Amenities → Inspect Room & Floor Details → In-App Chat / WhatsApp with Owner.
2. **Owner Listing Flow:** Owner Login → Add Property → Pin Exact Google Map Location → Upload 5+ Room/Bathroom Photos → Toggle 20+ Amenities → Configure Sharing Slots & Price → Publish.
3. **Room Sharing Engine:** Owner sets 4-sharing room at ₹3,500/bed → Tenant sees "2 of 4 beds occupied" → Tenant requests remaining bed → Real-time occupancy updates.

## 4. Information Architecture
- **Tenant Tabs:**
  - 🏠 **Khojo (Feed):** Curated nearby rooms, price sliders, quick filters
  - 🗺️ **Map View:** Interactive map pins, clustering, radius search
  - ❤️ **Saved:** Bookmarked properties with status alerts (e.g. "Price dropped")
  - 💬 **Messages:** In-app conversation threads with property owners
  - 👤 **Profile:** Tenant KYC status, preferences, language toggle (Hindi/English)
- **Owner Tabs:**
  - 📋 **My Listings:** Active properties, occupancy rate, pause/resume
  - ➕ **Add Property:** 5-step guided wizard
  - 💬 **Inquiries:** Tenant leads, scheduled visits
  - ⭐ **Reviews:** Tenant ratings & public responses
  - 👤 **Profile:** Owner verification badge & bank/UPI details

## 5. Data Model & API
- **Entities:** `User`, `Property`, `Room`, `RoomSharingSlot`, `Amenity`, `PropertyPhoto`, `Inquiry`, `Message`, `Review`, `SavedListing`.
- **Geospatial Engine:** PostGIS/Geolib calculations (Haversine distance within 5-10km).
- **State Management:**
  - Server State: TanStack Query with optimistic cache
  - Client State: Zustand (`useAuthStore`, `useFilterStore`, `useSavedStore`)

## 6. Stack Decisions
| Area | Choice | Why |
|---|---|---|
| **Mobile App** | React Native + Expo (SDK 52+) | Cross-platform (Android-first), Expo Router, seamless Web PWA preview |
| **Design System** | `theme.ts` + Tailwind / NativeWind | Mix A+C (Swiggy dark slate + Saffron orange + Emerald trust) |
| **Backend API** | Node.js + Express + TypeScript | Lightweight, fast REST endpoints, easy geospatial queries |
| **Database** | SQLite (dev) / PostgreSQL + PostGIS (prod) | Zero-friction local dev, spatial indexing in production |
| **Maps** | Google Maps Platform / Leaflet Web preview | Exact Indian street-level resolution |
| **Auth** | Phone OTP (Firebase Auth / Mock OTP in dev) | Standard Indian mobile login flow |

## 7. Design Direction
Chosen: **Mix A + C — Warm Saffron Energy on Deep Dark Slate** (see `docs/DESIGN.md`).

## 8. Vertical Slices (Build Order)
- [x] **Slice 0 — Foundation & Scaffold:** Project structure, design tokens, mock database, base components, server scaffold
- [ ] **Slice 1 — Owner: Multi-Step Property Listing:** 5-step listing wizard with photo upload, amenity checklist, sharing pricing
- [ ] **Slice 2 — Tenant: Search & Interactive Map Feed:** Filter sheet, map pins, distance calculation, listing cards
- [ ] **Slice 3 — Room Detail & Hyperlocal Amenities:** Photo carousel, floor details, Jal timing, nearby hospital/metro markers
- [ ] **Slice 4 — Shared Room Slot Engine:** Bed-level availability (e.g. 2/4 occupied), roommate profiles, booking request
- [ ] **Slice 5 — Inquiry & Chat System:** In-app messaging, visit scheduling, WhatsApp fallback
- [ ] **Slice 6 — Trust, Verification & Reviews:** Tenant review submission, owner KYC verification badge
- [ ] **Slice 7 — Notifications & Bookmarks:** Saved properties, push notifications, offline cache
- [ ] **Slice 8 — Hardening & Performance:** A11y checks, low-end Android optimization, TalkBack support

## 9. Risks & Open Questions
- **Offline Resilience:** Indian mobile networks often fluctuate in basement/interior rooms; local caching of searched properties is essential.
- **SMS OTP Costs:** Dev mode uses zero-cost mock OTP; production integrates DLT-compliant SMS gateway (MSG91/Twilio).

