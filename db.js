/**
 * TravelMate Minimal Persistent Database (IndexedDB)
 * Stores essential data:
 * - Trips: destination, dates, budget, travellers, preferences
 * - Itinerary: trip ID, day, city, hotel, activities
 * - Packing: trip ID, items
 * - Budget: trip ID, categories, amounts
 */

const DB_NAME = "TravelMateDB";
const DB_VERSION = 1;

const TravelMateDB = {
  db: null,

  // Initialize IndexedDB
  init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;

        // Trips table
        if (!db.objectStoreNames.contains("trips")) {
          db.createObjectStore("trips", { keyPath: "id", autoIncrement: true });
        }

        // Itinerary table
        if (!db.objectStoreNames.contains("itinerary")) {
          const itinStore = db.createObjectStore("itinerary", { keyPath: "id", autoIncrement: true });
          itinStore.createIndex("tripId", "tripId", { unique: false });
        }

        // Packing table
        if (!db.objectStoreNames.contains("packing")) {
          const packStore = db.createObjectStore("packing", { keyPath: "id", autoIncrement: true });
          packStore.createIndex("tripId", "tripId", { unique: false });
        }

        // Budget table
        if (!db.objectStoreNames.contains("budget")) {
          const budgetStore = db.createObjectStore("budget", { keyPath: "id", autoIncrement: true });
          budgetStore.createIndex("tripId", "tripId", { unique: false });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.error("IndexedDB open error:", e.target.error);
        reject(e.target.error);
      };
    });
  },

  // Save complete trip with itinerary, packing, and budget
  async saveTrip({ destination, dates, budget, travellers, preferences, days, packingItems, budgetData }) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(["trips", "itinerary", "packing", "budget"], "readwrite");
      const tripStore = tx.objectStore("trips");
      const itinStore = tx.objectStore("itinerary");
      const packStore = tx.objectStore("packing");
      const budgetStore = tx.objectStore("budget");

      // 1. Store Trip
      const tripRecord = {
        destination,
        dates,
        budget,
        travellers,
        preferences,
        createdAt: new Date().toISOString()
      };

      const tripReq = tripStore.add(tripRecord);

      tripReq.onsuccess = () => {
        const tripId = tripReq.result;

        // 2. Store Itinerary
        if (Array.isArray(days)) {
          days.forEach((d) => {
            itinStore.add({
              tripId,
              day: d.dayNum,
              city: destination,
              hotel: d.hotel || preferences.accommodation || "",
              activities: {
                title: d.title || "",
                vibe: d.vibe || "",
                morning: d.morning || {},
                afternoon: d.afternoon || {},
                evening: d.evening || {}
              }
            });
          });
        }

        // 3. Store Packing
        packStore.add({
          tripId,
          items: packingItems || []
        });

        // 4. Store Budget
        const categories = ["flights", "stays", "food", "activities", "shopping"];
        budgetStore.add({
          tripId,
          categories,
          amounts: budgetData || {
            total: budget,
            currency: "₹",
            flights: Math.round(budget * 0.32),
            stays: Math.round(budget * 0.35),
            food: Math.round(budget * 0.18),
            activities: Math.round(budget * 0.10),
            shopping: Math.round(budget * 0.05)
          }
        });

        resolve(tripId);
      };

      tx.onerror = (e) => reject(e.target.error);
    });
  },

  // Get all trips
  async getAllTrips() {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("trips", "readonly");
      const store = tx.objectStore("trips");
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e.target.error);
    });
  },

  // Get itinerary days for a trip
  async getItinerary(tripId) {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("itinerary", "readonly");
      const store = tx.objectStore("itinerary");
      const index = store.index("tripId");
      const req = index.getAll(tripId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e.target.error);
    });
  },

  // Get packing items for a trip
  async getPacking(tripId) {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("packing", "readonly");
      const store = tx.objectStore("packing");
      const index = store.index("tripId");
      const req = index.getAll(tripId);
      req.onsuccess = () => {
        const results = req.result;
        resolve(results && results.length > 0 ? results[results.length - 1].items : null);
      };
      req.onerror = (e) => reject(e.target.error);
    });
  },

  // Update packing items for a trip
  async savePacking(tripId, items) {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("packing", "readwrite");
      const store = tx.objectStore("packing");
      const index = store.index("tripId");
      const req = index.openCursor(tripId);

      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          const updated = cursor.value;
          updated.items = items;
          cursor.update(updated);
          resolve(updated);
        } else {
          store.add({ tripId, items });
          resolve();
        }
      };
      req.onerror = (e) => reject(e.target.error);
    });
  },

  // Get budget for a trip
  async getBudget(tripId) {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("budget", "readonly");
      const store = tx.objectStore("budget");
      const index = store.index("tripId");
      const req = index.getAll(tripId);
      req.onsuccess = () => {
        const results = req.result;
        resolve(results && results.length > 0 ? results[results.length - 1] : null);
      };
      req.onerror = (e) => reject(e.target.error);
    });
  },

  // Update budget for a trip
  async saveBudget(tripId, amounts) {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("budget", "readwrite");
      const store = tx.objectStore("budget");
      const index = store.index("tripId");
      const req = index.openCursor(tripId);
      const categories = ["flights", "stays", "food", "activities", "shopping"];

      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          const updated = cursor.value;
          updated.categories = categories;
          updated.amounts = amounts;
          cursor.update(updated);
          resolve(updated);
        } else {
          store.add({ tripId, categories, amounts });
          resolve();
        }
      };
      req.onerror = (e) => reject(e.target.error);
    });
  }
};

window.TravelMateDB = TravelMateDB;
