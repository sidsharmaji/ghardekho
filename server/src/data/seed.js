// Initial Indian Rental Properties Seed Data for GharDekho
module.exports = [
  {
    id: "prop-kota-01",
    title: "Saraswati PG & Study Rooms (Boys)",
    description: "Ideal for NEET/JEE aspirants. Sound-proof quiet rooms, dedicated study desks with ergonomic chairs, 100% generator power backup during study hours, and hygienic mess tie-up next door.",
    propertyType: "pg",
    category: "sharing_room",
    genderPreference: "male",
    city: "Kota",
    locality: "Talwandi, Near Allen Samarth",
    address: "Plot 42-B, Sector 2, Talwandi, Kota, Rajasthan 324005",
    coordinates: { lat: 25.1388, lng: 75.8344 },
    floor: 2,
    totalFloors: 4,
    hasLift: false,
    flooring: "Vitrified Tiles",
    isAvailable: true,
    isVerified: true,
    verificationBadge: "GharDekho Shield Verified",
    depositMonths: 1,
    depositAmount: 3800,
    noticePeriodDays: 30,
    rules: {
      curfewTime: "10:00 PM",
      visitorsAllowed: "In lobby only",
      cookingAllowed: false,
      smokingAllowed: false,
      ownerOnPremises: true
    },
    rooms: [
      {
        id: "room-k1",
        label: "Room 204 (4-Bed Split Sharing)",
        maxOccupancy: 4,
        currentOccupancy: 2,
        pricePerPerson: 3800,
        areaSqft: 280,
        bathroomType: "attached",
        hasBalcony: true,
        furnishing: "fully",
        slots: [
          { slotId: "s1", status: "occupied", tenantName: "Aryan S. (Allen 12th)", since: "2026-07-01" },
          { slotId: "s2", status: "occupied", tenantName: "Priyansh M. (Resonance Dropper)", since: "2026-08-15" },
          { slotId: "s3", status: "available", tenantName: null, since: null },
          { slotId: "s4", status: "available", tenantName: null, since: null }
        ]
      },
      {
        id: "room-k2",
        label: "Room 205 (Double Sharing)",
        maxOccupancy: 2,
        currentOccupancy: 1,
        pricePerPerson: 5500,
        areaSqft: 180,
        bathroomType: "attached",
        hasBalcony: false,
        furnishing: "fully",
        slots: [
          { slotId: "s5", status: "occupied", tenantName: "Devendra K.", since: "2026-06-01" },
          { slotId: "s6", status: "available", tenantName: null, since: null }
        ]
      }
    ],
    amenities: {
      electricityBackup: "Generator (Full 24hr)",
      waterSupply: "24 Hours (RO Drinking + Tank)",
      waterTiming: "24x7 Uninterrupted",
      hotWater: "Geyser (Attached)",
      wifi: "100 Mbps Dual-Band Fiber Included",
      cooling: "Desert Cooler Installed (AC on request + electricity extra)",
      kitchen: "No Cooking (Tiffin delivery & Mess within 50m)",
      bathroom: "Attached Western with Exhaust",
      washingMachine: true,
      parking: "Two-Wheeler Covered",
      security: "CCTV 24x7 + Biometric Gate",
      tiffinNearby: true
    },
    nearbyPlaces: [
      { name: "Allen Samarth Coaching", distance: "250 meters", type: "coaching" },
      { name: "Maitri Hospital & Trauma Center", distance: "600 meters", type: "hospital" },
      { name: "Talwandi Main Market & Stationery", distance: "150 meters", type: "market" },
      { name: "Indian Oil Petrol Pump", distance: "800 meters", type: "fuel" }
    ],
    photos: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
    ],
    owner: {
      id: "owner-sharma",
      name: "Ramesh Sharma (Ex-Teacher)",
      phone: "+91 98290 XXXXX",
      whatsapp: "919829000000",
      responseRate: "100% within 15 mins",
      memberSince: "Jan 2025",
      isKycDone: true
    },
    rating: 4.8,
    reviewsCount: 24
  },
  {
    id: "prop-pune-02",
    title: "Sunrise Studio Flat for IT Professionals",
    description: "Quiet, spacious 1RK Studio near Hinjawadi Phase 1. Complete independence, separate modular kitchen setup, high-speed fiber ready, and inverter line configured for work-from-home power cuts.",
    propertyType: "studio",
    category: "private_room",
    genderPreference: "any",
    city: "Pune",
    locality: "Hinjawadi Phase 1, Near Wipro Circle",
    address: "B-302, Laxmi Heights, Maan Road, Hinjawadi, Pune, Maharashtra 411057",
    coordinates: { lat: 18.5913, lng: 73.7389 },
    floor: 3,
    totalFloors: 6,
    hasLift: true,
    flooring: "Glossy Italian Tiles",
    isAvailable: true,
    isVerified: true,
    verificationBadge: "GharDekho Verified Owner",
    depositMonths: 2,
    depositAmount: 22000,
    noticePeriodDays: 30,
    rules: {
      curfewTime: "No Curfew (Self Keys)",
      visitorsAllowed: "Allowed anytime",
      cookingAllowed: true,
      smokingAllowed: "Balcony only",
      ownerOnPremises: false
    },
    rooms: [
      {
        id: "room-p1",
        label: "Full 1RK Studio Apartment",
        maxOccupancy: 2,
        currentOccupancy: 0,
        pricePerPerson: 11000,
        areaSqft: 420,
        bathroomType: "attached",
        hasBalcony: true,
        furnishing: "semi",
        slots: [
          { slotId: "sp1", status: "available", tenantName: null, since: null }
        ]
      }
    ],
    amenities: {
      electricityBackup: "Dedicated Inverter (Lights, Fans, WiFi Router 6hrs)",
      waterSupply: "Kaveri / Borewell 24hr",
      waterTiming: "24 Hours Continuous",
      hotWater: "Instant Geyser in Bathroom",
      wifi: "Fiber Provision (Jio / Airtel wired)",
      cooling: "Ceiling Fans in all areas",
      kitchen: "Separate Private Modular Kitchen with piped gas",
      bathroom: "Private Attached Western Bathroom",
      washingMachine: false,
      parking: "Covered 2-Wheeler + Reserved Car Slot",
      security: "Gated Society Guard + RFID entry",
      tiffinNearby: true
    },
    nearbyPlaces: [
      { name: "Wipro Technologies Hinjawadi", distance: "900 meters", type: "tech_park" },
      { name: "Ruby Hall Clinic Hinjawadi", distance: "1.4 km", type: "hospital" },
      { name: "D-Mart Supermarket", distance: "700 meters", type: "market" },
      { name: "HP Petrol Pump", distance: "500 meters", type: "fuel" }
    ],
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
    ],
    owner: {
      id: "owner-deshmukh",
      name: "Sunil Deshmukh (Software Architect)",
      phone: "+91 97654 XXXXX",
      whatsapp: "919765400000",
      responseRate: "Under 1 hour",
      memberSince: "Mar 2024",
      isKycDone: true
    },
    rating: 4.9,
    reviewsCount: 16
  },
  {
    id: "prop-jaipur-03",
    title: "Apna Aashiyana Girls PG (Near MNIT & Apex)",
    description: "Safe and welcoming home environment for female college students and interns. Strict security, home-cooked satvik food included in rent, power backup, and clean water tank storage.",
    propertyType: "pg",
    category: "sharing_room",
    genderPreference: "female",
    city: "Jaipur",
    locality: "Malviya Nagar, Sector 4",
    address: "4/112, Malviya Nagar, Near Calgiri Marg, Jaipur, Rajasthan 302017",
    coordinates: { lat: 26.8524, lng: 75.8175 },
    floor: 1,
    totalFloors: 3,
    hasLift: false,
    flooring: "Marble Flooring",
    isAvailable: true,
    isVerified: true,
    verificationBadge: "Verified Safe For Girls",
    depositMonths: 1,
    depositAmount: 4500,
    noticePeriodDays: 15,
    rules: {
      curfewTime: "08:30 PM",
      visitorsAllowed: "Parents only",
      cookingAllowed: "Light cooking in pantry",
      smokingAllowed: false,
      ownerOnPremises: true
    },
    rooms: [
      {
        id: "room-j1",
        label: "Room 102 (Triple Sharing with Balcony)",
        maxOccupancy: 3,
        currentOccupancy: 1,
        pricePerPerson: 4500,
        areaSqft: 240,
        bathroomType: "attached",
        hasBalcony: true,
        furnishing: "fully",
        slots: [
          { slotId: "sj1", status: "occupied", tenantName: "Pooja V. (MNIT B.Tech)", since: "2026-08-01" },
          { slotId: "sj2", status: "available", tenantName: null, since: null },
          { slotId: "sj3", status: "available", tenantName: null, since: null }
        ]
      }
    ],
    amenities: {
      electricityBackup: "Luminous Solar Inverter (8 Hours)",
      waterSupply: "PHED Jal Board Supply + 2000L Overhead Tank",
      waterTiming: "Morning 6:30-8:30 AM & Evening 6:00-8:00 PM (Tank fills 24h taps)",
      hotWater: "Geyser 25L in bathroom",
      wifi: "Airtel Xstream Fiber 200 Mbps Included",
      cooling: "Crompton High-Power Desert Cooler",
      kitchen: "Morning Breakfast & Dinner Included in Package",
      bathroom: "Attached Western with Ceramic Tiles",
      washingMachine: true,
      parking: "Two-Wheeler Locked Gate",
      security: "Female Warden + CCTV at Entrance",
      tiffinNearby: true
    },
    nearbyPlaces: [
      { name: "MNIT Jaipur Campus Gate 2", distance: "800 meters", type: "college" },
      { name: "Gaurav Tower (GT Central Mall)", distance: "500 meters", type: "market" },
      { name: "Fortis Escorts Hospital", distance: "1.2 km", type: "hospital" },
      { name: "Apex Bank ATM & BPCL", distance: "300 meters", type: "fuel" }
    ],
    photos: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
    ],
    owner: {
      id: "owner-gupta",
      name: "Anita & K.L. Gupta",
      phone: "+91 94140 XXXXX",
      whatsapp: "919414000000",
      responseRate: "Instant",
      memberSince: "Nov 2023",
      isKycDone: true
    },
    rating: 4.95,
    reviewsCount: 31
  },
  {
    id: "prop-delhi-04",
    title: "Metro Walk Budget Rooms for DU Students",
    description: "Affordable independent room on 1st floor near North Campus metro station. Huge terrace access, separate electricity sub-meter, peaceful study environment, and no landlord interference.",
    propertyType: "room",
    category: "private_room",
    genderPreference: "any",
    city: "Delhi",
    locality: "Kamla Nagar, Near Vishwavidyalaya Metro",
    address: "14/8, Ground Floor, Kolhapur Road, Kamla Nagar, Delhi 110007",
    coordinates: { lat: 28.6811, lng: 77.2062 },
    floor: 1,
    totalFloors: 3,
    hasLift: false,
    flooring: "Ceramic White Tiles",
    isAvailable: true,
    isVerified: true,
    verificationBadge: "Verified Landlord",
    depositMonths: 1,
    depositAmount: 6500,
    noticePeriodDays: 30,
    rules: {
      curfewTime: "No Curfew",
      visitorsAllowed: "Allowed",
      cookingAllowed: true,
      smokingAllowed: false,
      ownerOnPremises: false
    },
    rooms: [
      {
        id: "room-d1",
        label: "Single Independent Room (Room 12)",
        maxOccupancy: 1,
        currentOccupancy: 0,
        pricePerPerson: 6500,
        areaSqft: 160,
        bathroomType: "attached",
        hasBalcony: true,
        furnishing: "semi",
        slots: [
          { slotId: "sd1", status: "available", tenantName: null, since: null }
        ]
      }
    ],
    amenities: {
      electricityBackup: "Inverter point for fan and light",
      waterSupply: "Delhi Jal Board + Submersible Pump",
      waterTiming: "24hr (Motor runs morning and evening)",
      hotWater: "Geyser 15L",
      wifi: "Tenant installs own connection (JioFiber available)",
      cooling: "Ceiling Fan (Cooler space on window)",
      kitchen: "Separate cooking slab with sink in room corridor",
      bathroom: "Attached Western Toilet",
      washingMachine: false,
      parking: "Two-Wheeler on Street",
      security: "Locked Main Gate",
      tiffinNearby: true
    },
    nearbyPlaces: [
      { name: "Vishwavidyalaya Metro (Yellow Line)", distance: "650 meters", type: "metro" },
      { name: "Hindu College / Hansraj College", distance: "900 meters", type: "college" },
      { name: "Kamla Nagar Main Spark Mall", distance: "200 meters", type: "market" },
      { name: "Sant Parmanand Hospital", distance: "1.8 km", type: "hospital" }
    ],
    photos: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=800&q=80"
    ],
    owner: {
      id: "owner-verma",
      name: "Satish Verma",
      phone: "+91 98111 XXXXX",
      whatsapp: "919811100000",
      responseRate: "Within 30 mins",
      memberSince: "Aug 2024",
      isKycDone: true
    },
    rating: 4.6,
    reviewsCount: 19
  }
];

