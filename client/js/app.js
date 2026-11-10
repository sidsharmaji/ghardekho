// GharDekho Main Application Controller (Slice 0 Scaffold)
const GharDekho = (() => {
  let state = {
    currentRole: 'tenant', // 'tenant' | 'owner'
    activeTab: 'khojo',    // 'khojo' | 'map' | 'saved' | 'inquiries' | 'profile'
    activeCity: 'All',
    activeGender: 'any',
    activeType: 'all',
    searchQuery: '',
    budgetMax: 20000,
    savedIds: new Set(['prop-kota-01']),
    properties: [],
    inquiries: [],
    selectedProperty: null,
    ownerStep: 1
  };

  // DOM Elements
  const el = {
    shell: document.getElementById('deviceShell'),
    roleTenantBtn: document.getElementById('roleTenantBtn'),
    roleOwnerBtn: document.getElementById('roleOwnerBtn'),
    cityPill: document.getElementById('cityPill'),
    searchInput: document.getElementById('searchInput'),
    chipsContainer: document.getElementById('quickChips'),
    contentArea: document.getElementById('appContent'),
    bottomNav: document.getElementById('bottomNav'),
    detailModal: document.getElementById('detailModal'),
    modalContent: document.getElementById('modalContent'),
    toast: document.getElementById('toastMsg')
  };

  // Initialize App
  async function init() {
    setupEventListeners();
    await fetchProperties();
    render();
  }

  // Fetch properties from local API or fallback to seed
  async function fetchProperties() {
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      if (data.success && data.properties) {
        state.properties = data.properties;
      }
    } catch (e) {
      console.warn('API fetch failed, falling back to local dataset', e);
    }
  }

  // Fetch owner inquiries
  async function fetchInquiries() {
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.success) {
        state.inquiries = data.inquiries;
      }
    } catch (e) {
      console.warn('Inquiries fetch failed', e);
    }
  }

  // Show toast notification
  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.style.display = 'block';
    setTimeout(() => {
      el.toast.style.display = 'none';
    }, 3200);
  }

  // Event Listeners
  function setupEventListeners() {
    // Role switchers
    el.roleTenantBtn.addEventListener('click', () => switchRole('tenant'));
    el.roleOwnerBtn.addEventListener('click', () => switchRole('owner'));

    // Search input
    el.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase();
      renderFeed();
    });

    // Close detail modal on backdrop click
    el.detailModal.addEventListener('click', (e) => {
      if (e.target === el.detailModal) closeDetail();
    });
  }

  // Switch role between Tenant and Owner
  function switchRole(role) {
    state.currentRole = role;
    if (role === 'tenant') {
      el.roleTenantBtn.classList.add('active');
      el.roleOwnerBtn.classList.remove('active');
      state.activeTab = 'khojo';
    } else {
      el.roleOwnerBtn.classList.add('active');
      el.roleTenantBtn.classList.remove('active');
      state.activeTab = 'owner_listings';
      fetchInquiries();
    }
    renderNav();
    render();
    showToast(`Switched to ${role === 'tenant' ? 'Kirayedaar (Tenant)' : 'Makan Maalik (Owner)'} mode`);
  }

  // Render main content area based on role and tab
  function render() {
    if (state.currentRole === 'tenant') {
      if (state.activeTab === 'khojo') renderFeed();
      else if (state.activeTab === 'map') renderMapView();
      else if (state.activeTab === 'saved') renderSaved();
      else if (state.activeTab === 'messages') renderMessages();
      else if (state.activeTab === 'profile') renderProfile();
    } else {
      if (state.activeTab === 'owner_listings') renderOwnerListings();
      else if (state.activeTab === 'owner_add') renderOwnerAddWizard();
      else if (state.activeTab === 'owner_inquiries') renderOwnerInquiries();
      else if (state.activeTab === 'owner_profile') renderProfile();
    }
  }

  // Filter properties
  function getFilteredProperties() {
    return state.properties.filter(p => {
      const matchCity = state.activeCity === 'All' || p.city.toLowerCase() === state.activeCity.toLowerCase();
      const matchGender = state.activeGender === 'any' || p.genderPreference === state.activeGender || p.genderPreference === 'any';
      const matchType = state.activeType === 'all' || p.propertyType === state.activeType;
      const minPrice = Math.min(...p.rooms.map(r => r.pricePerPerson));
      const matchBudget = minPrice <= state.budgetMax;
      const matchQuery = !state.searchQuery || 
        p.title.toLowerCase().includes(state.searchQuery) ||
        p.locality.toLowerCase().includes(state.searchQuery) ||
        p.city.toLowerCase().includes(state.searchQuery);

      return matchCity && matchGender && matchType && matchBudget && matchQuery;
    });
  }

  // Render Tenant Feed
  function renderFeed() {
    const list = getFilteredProperties();
    
    let html = `
      <div class="view-mode-bar">
        <span class="results-count">Showing <b>${list.length}</b> verified rooms</span>
        <div class="view-toggle-btns">
          <button class="view-toggle-btn active" onclick="GharDekho.setTab('khojo')">List</button>
          <button class="view-toggle-btn" onclick="GharDekho.setTab('map')">Map</button>
        </div>
      </div>
      <div class="listings-grid">
    `;

    if (list.length === 0) {
      html += `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-secondary);">
          <div style="font-size: 40px; margin-bottom: 10px;">🔍</div>
          <h3 style="color: var(--text-primary); margin-bottom: 6px;">No rooms found in ${state.activeCity}</h3>
          <p style="font-size: 13px;">Try adjusting filters or searching a nearby locality</p>
          <button class="btn-inspect" style="margin-top: 14px;" onclick="GharDekho.resetFilters()">Reset All Filters</button>
        </div>
      `;
    } else {
      list.forEach(p => {
        const isSaved = state.savedIds.has(p.id);
        const minPrice = Math.min(...p.rooms.map(r => r.pricePerPerson));
        
        // Find if this property has shared rooms
        const sharedRoom = p.rooms.find(r => r.maxOccupancy > 1);

        html += `
          <div class="property-card" onclick="GharDekho.openDetail('${p.id}')">
            <div class="card-media">
              <img src="${p.photos[0]}" alt="${p.title}" loading="lazy" />
              <div class="card-badges-top">
                <span class="badge-tag ${p.isVerified ? 'verified' : ''}">
                  ${p.isVerified ? '🛡️ ' + p.verificationBadge : p.propertyType.toUpperCase()}
                </span>
                <button class="heart-btn ${isSaved ? 'saved' : ''}" onclick="event.stopPropagation(); GharDekho.toggleSave('${p.id}')">
                  ${isSaved ? '❤️' : '🤍'}
                </button>
              </div>
            </div>

            <div class="card-body">
              <div class="card-locality">
                📍 ${p.locality}, ${p.city}
              </div>
              <h3 class="card-title">${p.title}</h3>

              <!-- Indian Specific Highlights -->
              <div class="trust-strip">
                <span class="trust-item alert-water">💧 ${p.amenities.waterSupply}</span>
                <span class="trust-item power-backup">⚡ ${p.amenities.electricityBackup.split(' ')[0]} Backup</span>
                <span class="trust-item">🚿 ${p.amenities.bathroom.split(' ')[0]} Bath</span>
                <span class="trust-item">🛏️ ${p.flooring}</span>
              </div>

              <!-- Live Shared Room Beds Available -->
              ${sharedRoom ? `
                <div class="sharing-slot-bar">
                  <div class="sharing-slot-info">
                    <span style="font-size: 11px; font-weight: 700; color: var(--color-student);">
                      ${sharedRoom.label.split('(')[0]}
                    </span>
                    <span style="font-size: 11px; color: var(--text-muted);">
                      (${sharedRoom.maxOccupancy - sharedRoom.currentOccupancy} of ${sharedRoom.maxOccupancy} Beds Available)
                    </span>
                  </div>
                  <div class="bed-icons-row">
                    ${sharedRoom.slots.map(s => `
                      <span class="bed-icon ${s.status === 'occupied' ? 'occupied' : ''}" title="${s.status === 'occupied' ? 'Occupied' : 'Vacant Bed'}">
                        🛏️
                      </span>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <div class="card-footer">
                <div class="price-block">
                  <span class="price-amount">₹${minPrice.toLocaleString('en-IN')}</span>
                  <span class="price-sub">per person / month</span>
                </div>
                <button class="btn-inspect">View & Book</button>
              </div>
            </div>
          </div>
        `;
      });
    }

    html += `</div>`;
    el.contentArea.innerHTML = html;
  }

  // Render Map View
  function renderMapView() {
    const list = getFilteredProperties();
    el.contentArea.innerHTML = `
      <div class="view-mode-bar">
        <span class="results-count">Showing <b>${list.length}</b> locations on map</span>
        <div class="view-toggle-btns">
          <button class="view-toggle-btn" onclick="GharDekho.setTab('khojo')">List</button>
          <button class="view-toggle-btn active" onclick="GharDekho.setTab('map')">Map</button>
        </div>
      </div>

      <div class="map-container">
        <div class="map-placeholder">
          <div class="map-pin-pulse"></div>
          <h4 style="color: var(--text-primary); margin-bottom: 4px;">Interactive Google Maps View</h4>
          <p style="font-size: 12px; max-width: 280px; margin-bottom: 12px;">
            Showing pinned verified rooms around ${state.activeCity}. Tap any pin to inspect rooms & nearby landmarks.
          </p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;">
            ${list.map(p => `
              <button class="chip" style="font-size: 11px;" onclick="GharDekho.openDetail('${p.id}')">
                📍 ${p.locality.split(',')[0]} (₹${Math.min(...p.rooms.map(r => r.pricePerPerson))})
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <h4 style="font-size: 14px; margin-bottom: 10px; color: var(--text-primary);">Nearest Listings:</h4>
      <div class="listings-grid">
        ${list.slice(0, 2).map(p => `
          <div class="property-card" onclick="GharDekho.openDetail('${p.id}')" style="margin-bottom: 8px;">
            <div class="card-body">
              <div class="card-locality">📍 ${p.locality}</div>
              <h3 class="card-title" style="font-size: 14px;">${p.title}</h3>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                <span style="font-family: var(--font-mono); font-weight: 700; color: var(--color-primary);">
                  ₹${Math.min(...p.rooms.map(r => r.pricePerPerson))}/mo
                </span>
                <span style="font-size: 12px; color: var(--color-trust);">Tap to view</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Render Detail Bottom Sheet / Modal
  function openDetail(id) {
    const p = state.properties.find(item => item.id === id);
    if (!p) return;
    state.selectedProperty = p;

    const minPrice = Math.min(...p.rooms.map(r => r.pricePerPerson));

    el.modalContent.innerHTML = `
      <div class="sheet-handle"></div>
      <button class="sheet-close-btn" onclick="GharDekho.closeDetail()">✕</button>

      <div style="margin-bottom: 14px;">
        <span class="badge-tag verified" style="margin-bottom: 6px;">
          🛡️ ${p.verificationBadge}
        </span>
        <h2 style="font-family: var(--font-display); font-size: 20px; line-height: 1.3; color: var(--text-primary);">
          ${p.title}
        </h2>
        <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
          📍 ${p.address}
        </div>
      </div>

      <!-- Photo Gallery -->
      <div style="display: flex; gap: 8px; overflow-x: auto; margin-bottom: 16px; border-radius: var(--radius-md); overflow: hidden;">
        ${p.photos.map(url => `
          <img src="${url}" style="height: 160px; border-radius: var(--radius-md); object-fit: cover;" alt="Room View" />
        `).join('')}
      </div>

      <!-- Key Stats Bar -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: var(--bg-surface-raised); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 16px; text-align: center;">
        <div>
          <div style="font-size: 11px; color: var(--text-muted);">Floor</div>
          <div style="font-size: 13px; font-weight: 700;">${p.floor} of ${p.totalFloors} (${p.flooring.split(' ')[0]})</div>
        </div>
        <div>
          <div style="font-size: 11px; color: var(--text-muted);">Gender</div>
          <div style="font-size: 13px; font-weight: 700; text-transform: capitalize;">${p.genderPreference} Only</div>
        </div>
        <div>
          <div style="font-size: 11px; color: var(--text-muted);">Deposit</div>
          <div style="font-size: 13px; font-weight: 700;">₹${p.depositAmount} (${p.depositMonths} mo)</div>
        </div>
      </div>

      <!-- Split Sharing Rooms & Live Beds -->
      <h3 style="font-size: 15px; font-family: var(--font-display); margin-bottom: 10px;">
        🛏️ Available Room Configurations & Beds
      </h3>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
        ${p.rooms.map(room => `
          <div style="background: var(--bg-surface-raised); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div>
                <strong style="color: var(--text-primary); font-size: 14px;">${room.label}</strong>
                <div style="font-size: 11px; color: var(--text-muted);">${room.areaSqft} sq.ft · ${room.furnishing} furnished · ${room.bathroomType} bath</div>
              </div>
              <div style="text-align: right;">
                <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: var(--color-primary);">
                  ₹${room.pricePerPerson.toLocaleString('en-IN')}<span style="font-size: 11px; font-weight: 400; color: var(--text-muted);">/bed</span>
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
              ${room.slots.map(s => `
                <div style="background: ${s.status === 'occupied' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.15)'}; border: 1px solid ${s.status === 'occupied' ? 'rgba(239, 68, 68, 0.3)' : 'var(--color-trust)'}; padding: 6px 10px; border-radius: var(--radius-sm); font-size: 11px; display: flex; align-items: center; gap: 6px;">
                  <span>🛏️ Slot ${s.slotId.toUpperCase()}</span>
                  <span style="font-weight: 700; color: ${s.status === 'occupied' ? '#EF4444' : 'var(--color-trust)'};">
                    ${s.status === 'occupied' ? 'Occupied' : 'Vacant'}
                  </span>
                  ${s.status === 'available' ? `
                    <button style="background: var(--color-trust); border: none; color: #FFF; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 4px; cursor: pointer; margin-left: 4px;" onclick="GharDekho.bookBed('${p.id}', '${room.id}', '${s.slotId}')">
                      Book Bed
                    </button>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Verified Amenities Checklist (20+ Indian specifics) -->
      <h3 style="font-size: 15px; font-family: var(--font-display); margin-bottom: 10px;">
        ✅ Verified Property Amenities
      </h3>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 20px; font-size: 12px;">
        <div class="trust-item power-backup">⚡ <b>Power:</b> ${p.amenities.electricityBackup}</div>
        <div class="trust-item alert-water">💧 <b>Water:</b> ${p.amenities.waterSupply}</div>
        <div class="trust-item">⏰ <b>Water Timing:</b> ${p.amenities.waterTiming}</div>
        <div class="trust-item">📶 <b>WiFi:</b> ${p.amenities.wifi}</div>
        <div class="trust-item">❄️ <b>Cooling:</b> ${p.amenities.cooling}</div>
        <div class="trust-item">🚿 <b>Bathroom:</b> ${p.amenities.bathroom}</div>
        <div class="trust-item">🍳 <b>Cooking:</b> ${p.amenities.kitchen}</div>
        <div class="trust-item">🚗 <b>Parking:</b> ${p.amenities.parking}</div>
        <div class="trust-item">🔒 <b>Security:</b> ${p.amenities.security}</div>
        <div class="trust-item">🥘 <b>Tiffin Nearby:</b> ${p.amenities.tiffinNearby ? 'Yes (50m)' : 'Self-cook'}</div>
      </div>

      <!-- Nearby Landmarks (Google Places API integration) -->
      <h3 style="font-size: 15px; font-family: var(--font-display); margin-bottom: 10px;">
        📍 Nearby Places (Distance Verified)
      </h3>
      <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 24px;">
        ${p.nearbyPlaces.map(place => `
          <div style="display: flex; justify-content: space-between; background: var(--bg-surface-raised); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 12px; border: 1px solid var(--border-subtle);">
            <span>🏢 ${place.name}</span>
            <strong style="color: var(--color-primary);">${place.distance}</strong>
          </div>
        `).join('')}
      </div>

      <!-- Owner Contact Bar -->
      <div style="background: var(--bg-surface-raised); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: 14px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <div style="font-size: 11px; color: var(--color-trust); font-weight: 700;">MAKAN MAALIK (OWNER)</div>
          <div style="font-size: 14px; font-weight: 700; color: var(--text-primary);">${p.owner.name}</div>
          <div style="font-size: 11px; color: var(--text-muted);">Response: ${p.owner.responseRate}</div>
        </div>
        <div style="display: flex; gap: 8px;">
          <a href="https://wa.me/${p.owner.whatsapp}?text=Namaste, I saw your room listing on GharDekho: ${encodeURIComponent(p.title)}" target="_blank" style="background: #25D366; color: #FFF; text-decoration: none; padding: 8px 12px; border-radius: var(--radius-md); font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
            💬 WhatsApp
          </a>
          <button onclick="GharDekho.openInquiryModal('${p.id}')" class="btn-inspect" style="padding: 8px 12px; font-size: 12px;">
            In-App Inquiry
          </button>
        </div>
      </div>
    `;

    el.detailModal.classList.add('open');
  }

  function closeDetail() {
    el.detailModal.classList.remove('open');
  }

  // Book a single bed slot in a shared room
  async function bookBed(propertyId, roomId, slotId) {
    const tenantName = prompt('Enter your name for bed booking:', 'Aryan');
    if (!tenantName) return;

    try {
      const res = await fetch(`/api/properties/${propertyId}/book-slot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, slotId, tenantName, tenantPhone: '+91 98765 43210' })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🎉 Success: Bed slot reserved! Owner notified.`);
        await fetchProperties();
        openDetail(propertyId);
      } else {
        alert(data.message);
      }
    } catch (e) {
      showToast('Bed reserved locally! (Offline Mode)');
    }
  }

  // Toggle Save Property
  function toggleSave(id) {
    if (state.savedIds.has(id)) {
      state.savedIds.delete(id);
      showToast('Removed from saved rooms');
    } else {
      state.savedIds.add(id);
      showToast('❤️ Saved to your shortlisted rooms');
    }
    render();
  }

  // Render Saved Tab
  function renderSaved() {
    const savedList = state.properties.filter(p => state.savedIds.has(p.id));
    el.contentArea.innerHTML = `
      <div style="margin-bottom: 16px;">
        <h2 style="font-family: var(--font-display); font-size: 20px; color: var(--text-primary);">
          Shortlisted Rooms (${savedList.length})
        </h2>
        <p style="font-size: 12px; color: var(--text-secondary);">Your saved rooms with live availability tracking</p>
      </div>
    `;

    if (savedList.length === 0) {
      el.contentArea.innerHTML += `
        <div style="text-align: center; padding: 60px 10px; color: var(--text-secondary);">
          <div style="font-size: 40px; margin-bottom: 10px;">🤍</div>
          <h3 style="color: var(--text-primary); margin-bottom: 6px;">No saved rooms yet</h3>
          <p style="font-size: 13px;">Tap the heart icon on any listing to shortlist it for easy comparison</p>
        </div>
      `;
      return;
    }

    let grid = '<div class="listings-grid">';
    savedList.forEach(p => {
      grid += `
        <div class="property-card" onclick="GharDekho.openDetail('${p.id}')">
          <div class="card-body">
            <div class="card-locality">📍 ${p.locality}, ${p.city}</div>
            <h3 class="card-title">${p.title}</h3>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
              <span class="price-amount">₹${Math.min(...p.rooms.map(r => r.pricePerPerson))}/mo</span>
              <button class="btn-inspect">View Details</button>
            </div>
          </div>
        </div>
      `;
    });
    grid += '</div>';
    el.contentArea.innerHTML += grid;
  }

  // Render Inquiries / Chat
  function renderMessages() {
    el.contentArea.innerHTML = `
      <div style="margin-bottom: 16px;">
        <h2 style="font-family: var(--font-display); font-size: 20px; color: var(--text-primary);">
          Messages & Scheduled Visits
        </h2>
        <p style="font-size: 12px; color: var(--text-secondary);">In-app conversations with Makan Maaliks</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <strong style="color: var(--text-primary);">Ramesh Sharma (Talwandi PG)</strong>
            <span style="font-size: 11px; color: var(--color-trust);">Confirmed Visit</span>
          </div>
          <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">
            "Haan beta, Room 204 me 2 beds khali hai. Kal 11 baje aa jao dekhne."
          </p>
          <div style="font-size: 11px; color: var(--color-primary); font-weight: 600;">
            📅 Scheduled Visit: Tomorrow, 11:00 AM
          </div>
        </div>
      </div>
    `;
  }

  // Render Profile
  function renderProfile() {
    el.contentArea.innerHTML = `
      <div style="margin-bottom: 16px; text-align: center; padding-top: 20px;">
        <div style="width: 72px; height: 72px; background: var(--gradient-primary); border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 32px; box-shadow: var(--shadow-glow);">
          👤
        </div>
        <h2 style="font-family: var(--font-display); font-size: 18px; color: var(--text-primary);">
          ${state.currentRole === 'tenant' ? 'Aman Kumar (Student)' : 'Satish Sharma (Property Owner)'}
        </h2>
        <div style="font-size: 12px; color: var(--color-trust); font-weight: 600; margin-top: 2px;">
          🛡️ Aadhaar Verified Resident
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="background: var(--bg-surface); padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; justify-content: space-between;">
          <span>Language (भाषा)</span>
          <strong style="color: var(--color-primary);">Hinglish / Hindi</strong>
        </div>
        <div style="background: var(--bg-surface); padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; justify-content: space-between;">
          <span>City Preference</span>
          <strong style="color: var(--text-primary);">${state.activeCity}</strong>
        </div>
        <div style="background: var(--bg-surface); padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; justify-content: space-between;">
          <span>Dark Theme Active</span>
          <strong style="color: var(--color-trust);">Mix A+C Swiggy Saffron</strong>
        </div>
        <div style="background: var(--bg-surface); padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; justify-content: space-between;">
          <span>GharDekho App Version</span>
          <span style="color: var(--text-muted);">v1.0.0 (Slice 0 Scaffold)</span>
        </div>
      </div>
    `;
  }

  // --- OWNER FLOW ---
  function renderOwnerListings() {
    el.contentArea.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <h2 style="font-family: var(--font-display); font-size: 20px; color: var(--text-primary);">
            Makan Maalik Dashboard
          </h2>
          <p style="font-size: 12px; color: var(--text-secondary);">Manage your rental properties & bed occupancy</p>
        </div>
        <button class="btn-inspect" onclick="GharDekho.setTab('owner_add')">
          + Add Room
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 20px; text-align: center;">
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 10px; border-radius: var(--radius-md);">
          <div style="font-size: 11px; color: var(--text-muted);">Active Rooms</div>
          <div style="font-size: 18px; font-weight: 700; color: var(--color-primary);">${state.properties.length}</div>
        </div>
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 10px; border-radius: var(--radius-md);">
          <div style="font-size: 11px; color: var(--text-muted);">Occupancy</div>
          <div style="font-size: 18px; font-weight: 700; color: var(--color-trust);">78%</div>
        </div>
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 10px; border-radius: var(--radius-md);">
          <div style="font-size: 11px; color: var(--text-muted);">New Inquiries</div>
          <div style="font-size: 18px; font-weight: 700; color: var(--color-student);">${state.inquiries.length}</div>
        </div>
      </div>

      <h3 style="font-size: 15px; margin-bottom: 10px;">Your Properties:</h3>
      <div class="listings-grid">
        ${state.properties.map(p => `
          <div class="property-card" onclick="GharDekho.openDetail('${p.id}')">
            <div class="card-body">
              <div class="card-locality">📍 ${p.locality}</div>
              <h3 class="card-title">${p.title}</h3>
              <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">
                ${p.rooms.map(r => `${r.label}: ${r.currentOccupancy}/${r.maxOccupancy} Beds`).join(' • ')}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="badge-tag verified">● Active on GharDekho</span>
                <span style="font-size: 12px; color: var(--color-primary); font-weight: 700;">Manage Slots →</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Owner 5-Step Property Creation Wizard
  function renderOwnerAddWizard() {
    el.contentArea.innerHTML = `
      <div style="margin-bottom: 16px;">
        <h2 style="font-family: var(--font-display); font-size: 20px; color: var(--text-primary);">
          List New Property (Makan Maalik)
        </h2>
        <p style="font-size: 12px; color: var(--text-secondary);">Step ${state.ownerStep} of 4: Fill property details for verified listing</p>
      </div>

      <div class="wizard-box">
        <div class="wizard-step-indicator">
          <div class="step-node ${state.ownerStep >= 1 ? 'active' : ''}">1</div>
          <div class="step-node ${state.ownerStep >= 2 ? 'active' : ''}">2</div>
          <div class="step-node ${state.ownerStep >= 3 ? 'active' : ''}">3</div>
          <div class="step-node ${state.ownerStep >= 4 ? 'active' : ''}">4</div>
        </div>

        ${state.ownerStep === 1 ? `
          <h4 style="margin-bottom: 12px; color: var(--text-primary);">Step 1: Basic Information</h4>
          <div class="form-group">
            <label class="form-label">Property Title / PG Name</label>
            <input type="text" id="ownerTitle" class="form-input" placeholder="e.g. Balaji PG for Boys (Near Allen)" value="Shree Krishna Residency" />
          </div>
          <div class="form-group">
            <label class="form-label">City</label>
            <select id="ownerCity" class="form-select">
              <option value="Kota">Kota</option>
              <option value="Pune">Pune</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Locality / Colony</label>
            <input type="text" id="ownerLocality" class="form-input" placeholder="e.g. Landmark City, Kunhari" value="Vigyan Nagar" />
          </div>
          <div class="form-group">
            <label class="form-label">Property Type</label>
            <select id="ownerType" class="form-select">
              <option value="pg">PG / Hostel</option>
              <option value="room">Independent Room</option>
              <option value="flat">Full Flat / 1BHK</option>
              <option value="studio">Studio Apartment</option>
            </select>
          </div>
          <button class="btn-inspect" style="width: 100%; margin-top: 10px; justify-content: center;" onclick="GharDekho.nextOwnerStep()">
            Next: Water & Power Amenities →
          </button>
        ` : ''}

        ${state.ownerStep === 2 ? `
          <h4 style="margin-bottom: 12px; color: var(--text-primary);">Step 2: Indian Specific Amenities</h4>
          <div class="form-group">
            <label class="form-label">⚡ Electricity Backup</label>
            <select id="ownerPower" class="form-select">
              <option value="Generator (Full 24hr)">24hr Generator Backup</option>
              <option value="Inverter (Lights, Fan & WiFi)">Inverter (Lights, Fan, WiFi)</option>
              <option value="No Backup">No Power Backup</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">💧 Water Supply & Timing</label>
            <select id="ownerWater" class="form-select">
              <option value="24 Hours (RO + Tank)">24 Hours RO + Tank Supply</option>
              <option value="Morning & Evening Timing">Timing-based (6-8 AM & 6-8 PM)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">🚿 Bathroom Configuration</label>
            <select id="ownerBathroom" class="form-select">
              <option value="Attached Western">Attached Western Toilet</option>
              <option value="Common Bathroom">Common Shared Bathroom</option>
            </select>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 16px;">
            <button class="chip" onclick="GharDekho.prevOwnerStep()">← Back</button>
            <button class="btn-inspect" style="flex: 1; justify-content: center;" onclick="GharDekho.nextOwnerStep()">
              Next: Bed Sharing & Rent →
            </button>
          </div>
        ` : ''}

        ${state.ownerStep === 3 ? `
          <h4 style="margin-bottom: 12px; color: var(--text-primary);">Step 3: Room Sharing & Price</h4>
          <div class="form-group">
            <label class="form-label">Sharing Option</label>
            <select id="ownerSharing" class="form-select">
              <option value="4">4-Bed Sharing (Split Room)</option>
              <option value="2">Double Sharing (2-Bed)</option>
              <option value="1">Single Independent Bed</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Rent Per Person (₹/month)</label>
            <input type="number" id="ownerRent" class="form-input" value="4000" />
          </div>
          <div class="form-group">
            <label class="form-label">Security Deposit (₹)</label>
            <input type="number" id="ownerDeposit" class="form-input" value="4000" />
          </div>
          <div style="display: flex; gap: 8px; margin-top: 16px;">
            <button class="chip" onclick="GharDekho.prevOwnerStep()">← Back</button>
            <button class="btn-inspect" style="flex: 1; justify-content: center;" onclick="GharDekho.submitNewProperty()">
              Publish Property Now 🚀
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  function nextOwnerStep() {
    state.ownerStep++;
    renderOwnerAddWizard();
  }

  function prevOwnerStep() {
    state.ownerStep--;
    renderOwnerAddWizard();
  }

  // Submit new property
  async function submitNewProperty() {
    const title = document.getElementById('ownerTitle')?.value || 'New PG Room';
    const city = document.getElementById('ownerCity')?.value || 'Kota';
    const locality = document.getElementById('ownerLocality')?.value || 'Near Coaching';
    const rent = Number(document.getElementById('ownerRent')?.value || 4200);

    const newProp = {
      title,
      description: "Newly listed verified room on GharDekho. Verified water timing, power backup, and quiet study environment.",
      propertyType: "pg",
      category: "sharing_room",
      genderPreference: "male",
      city,
      locality,
      address: `${locality}, ${city}`,
      coordinates: { lat: 25.138, lng: 75.834 },
      floor: 1,
      totalFloors: 3,
      hasLift: false,
      flooring: "Vitrified Tiles",
      isAvailable: true,
      isVerified: true,
      verificationBadge: "New Verified Listing",
      depositMonths: 1,
      depositAmount: rent,
      noticePeriodDays: 30,
      rules: { curfewTime: "10:00 PM", visitorsAllowed: "Lobby only", cookingAllowed: false, ownerOnPremises: true },
      rooms: [
        {
          id: `room-${Date.now()}`,
          label: "Room 101 (Split Sharing)",
          maxOccupancy: 4,
          currentOccupancy: 0,
          pricePerPerson: rent,
          areaSqft: 260,
          bathroomType: "attached",
          hasBalcony: true,
          furnishing: "fully",
          slots: [
            { slotId: "s1", status: "available", tenantName: null },
            { slotId: "s2", status: "available", tenantName: null },
            { slotId: "s3", status: "available", tenantName: null },
            { slotId: "s4", status: "available", tenantName: null }
          ]
        }
      ],
      amenities: {
        electricityBackup: "Generator (Full 24hr)",
        waterSupply: "24 Hours (RO + Tank)",
        waterTiming: "24x7 Uninterrupted",
        hotWater: "Geyser Included",
        wifi: "Fiber 100 Mbps",
        cooling: "Desert Cooler",
        kitchen: "Tiffin Service Nearby",
        bathroom: "Attached Western",
        washingMachine: true,
        parking: "Two-Wheeler",
        security: "CCTV 24x7",
        tiffinNearby: true
      },
      nearbyPlaces: [
        { name: "Main Market & Pharmacy", distance: "200m" },
        { name: "Hospital & Medical Store", distance: "600m" }
      ],
      photos: [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
      ],
      owner: {
        id: "owner-self",
        name: "Self (Makan Maalik)",
        phone: "+91 98290 XXXXX",
        whatsapp: "919829000000",
        responseRate: "Instant",
        isKycDone: true
      },
      rating: 5.0,
      reviewsCount: 0
    };

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProp)
      });
      const data = await res.json();
      if (data.success) {
        state.properties.unshift(data.property);
      }
    } catch (e) {
      state.properties.unshift(newProp);
    }

    state.ownerStep = 1;
    state.activeTab = 'owner_listings';
    showToast('🎉 Property published successfully!');
    render();
  }

  // Render Owner Inquiries
  function renderOwnerInquiries() {
    el.contentArea.innerHTML = `
      <div style="margin-bottom: 16px;">
        <h2 style="font-family: var(--font-display); font-size: 20px; color: var(--text-primary);">
          Incoming Tenant Inquiries (${state.inquiries.length})
        </h2>
        <p style="font-size: 12px; color: var(--text-secondary);">Direct leads from students and working professionals</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${state.inquiries.map(inq => `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <strong style="color: var(--text-primary); font-size: 15px;">${inq.tenantName}</strong>
              <span class="badge-tag verified">New Lead</span>
            </div>
            <div style="font-size: 11px; color: var(--color-primary); margin-bottom: 6px;">
              Property: ${inq.propertyTitle}
            </div>
            <p style="font-size: 13px; color: var(--text-secondary); background: var(--bg-surface-raised); padding: 8px 10px; border-radius: var(--radius-sm); margin-bottom: 10px;">
              "${inq.message}"
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 11px; color: var(--text-muted);">📞 ${inq.tenantPhone}</span>
              <button class="btn-inspect" style="padding: 6px 12px; font-size: 11px;" onclick="alert('Calling tenant: ' + '${inq.tenantPhone}')">
                Call Tenant
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Render Bottom Nav Tabs based on Role
  function renderNav() {
    if (state.currentRole === 'tenant') {
      el.bottomNav.innerHTML = `
        <button class="nav-item ${state.activeTab === 'khojo' ? 'active' : ''}" onclick="GharDekho.setTab('khojo')">
          <span class="nav-icon">🏠</span>
          <span>Khojo</span>
        </button>
        <button class="nav-item ${state.activeTab === 'map' ? 'active' : ''}" onclick="GharDekho.setTab('map')">
          <span class="nav-icon">🗺️</span>
          <span>Map</span>
        </button>
        <button class="nav-item ${state.activeTab === 'saved' ? 'active' : ''}" onclick="GharDekho.setTab('saved')">
          <span class="nav-icon">❤️</span>
          <span>Saved</span>
        </button>
        <button class="nav-item ${state.activeTab === 'messages' ? 'active' : ''}" onclick="GharDekho.setTab('messages')">
          <span class="nav-icon">💬</span>
          <span>Chat</span>
        </button>
        <button class="nav-item ${state.activeTab === 'profile' ? 'active' : ''}" onclick="GharDekho.setTab('profile')">
          <span class="nav-icon">👤</span>
          <span>Profile</span>
        </button>
      `;
    } else {
      el.bottomNav.innerHTML = `
        <button class="nav-item ${state.activeTab === 'owner_listings' ? 'active' : ''}" onclick="GharDekho.setTab('owner_listings')">
          <span class="nav-icon">📋</span>
          <span>My Rooms</span>
        </button>
        <button class="nav-item ${state.activeTab === 'owner_add' ? 'active' : ''}" onclick="GharDekho.setTab('owner_add')">
          <span class="nav-icon">➕</span>
          <span>Add Room</span>
        </button>
        <button class="nav-item ${state.activeTab === 'owner_inquiries' ? 'active' : ''}" onclick="GharDekho.setTab('owner_inquiries')">
          <span class="nav-icon">💬</span>
          <span>Inquiries</span>
        </button>
        <button class="nav-item ${state.activeTab === 'owner_profile' ? 'active' : ''}" onclick="GharDekho.setTab('owner_profile')">
          <span class="nav-icon">👤</span>
          <span>Profile</span>
        </button>
      `;
    }
  }

  function setTab(tab) {
    state.activeTab = tab;
    renderNav();
    render();
  }

  function setCity(city) {
    state.activeCity = city;
    el.cityPill.textContent = '📍 ' + city;
    render();
    showToast(`Filtering rooms in ${city}`);
  }

  function resetFilters() {
    state.activeCity = 'All';
    state.activeGender = 'any';
    state.activeType = 'all';
    state.searchQuery = '';
    el.searchInput.value = '';
    el.cityPill.textContent = '📍 All Cities';
    render();
  }

  function openInquiryModal(propId) {
    const p = state.properties.find(item => item.id === propId);
    const msg = prompt(`Send inquiry to ${p.owner.name}:`, "Namaste Sir, I am interested in this room. Can I schedule a visit?");
    if (!msg) return;

    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyId: propId,
        tenantName: "Pooja Sharma",
        tenantPhone: "+91 99887 76655",
        message: msg
      })
    }).then(() => {
      showToast('Inquiry sent! Owner will reply within 15 mins.');
      closeDetail();
    });
  }

  function toggleViewport() {
    el.shell.classList.toggle('mode-wide');
    const isWide = el.shell.classList.contains('mode-wide');
    document.getElementById('viewportBtn').textContent = isWide ? '📱 Mobile' : '💻 Wide';
  }

  return {
    init,
    setTab,
    setCity,
    resetFilters,
    openDetail,
    closeDetail,
    bookBed,
    toggleSave,
    nextOwnerStep,
    prevOwnerStep,
    submitNewProperty,
    openInquiryModal,
    toggleViewport
  };
})();

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', GharDekho.init);

