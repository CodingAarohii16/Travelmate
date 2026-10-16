const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

// Load .env configuration
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = val;
      }
    }
  });
}

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, "travelmate.db");

// --- DATABASE SETUP ---
const db = new DatabaseSync(DB_FILE);

db.exec(`
  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    destination TEXT NOT NULL,
    dates TEXT NOT NULL,
    budget REAL NOT NULL,
    travellers TEXT NOT NULL,
    preferences TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS itinerary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tripId INTEGER NOT NULL,
    day INTEGER NOT NULL,
    city TEXT NOT NULL,
    hotel TEXT,
    activities TEXT NOT NULL,
    FOREIGN KEY(tripId) REFERENCES trips(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS packing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tripId INTEGER NOT NULL,
    items TEXT NOT NULL,
    FOREIGN KEY(tripId) REFERENCES trips(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS budget (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tripId INTEGER NOT NULL,
    categories TEXT NOT NULL,
    amounts TEXT NOT NULL,
    FOREIGN KEY(tripId) REFERENCES trips(id) ON DELETE CASCADE
  );
`);

// Seed default trip if empty
const countStmt = db.prepare("SELECT COUNT(*) as count FROM trips");
if (countStmt.get().count === 0) {
  const insertTrip = db.prepare(`
    INSERT INTO trips (destination, dates, budget, travellers, preferences)
    VALUES (?, ?, ?, ?, ?)
  `);
  const res = insertTrip.run(
    "Kyoto, Japan",
    JSON.stringify({ depDate: "2026-04-10", retDate: "2026-04-16", days: 7 }),
    150000,
    JSON.stringify({ count: 2, type: "Couple" }),
    JSON.stringify({ style: "Cultural & Relaxed", accommodation: "Machiya Ryokan Kamo River", pace: "Relaxed" })
  );
  const tripId = res.lastInsertRowid;

  const insertItin = db.prepare("INSERT INTO itinerary (tripId, day, city, hotel, activities) VALUES (?, ?, ?, ?, ?)");
  insertItin.run(
    tripId,
    1,
    "Kyoto, Japan",
    "Machiya Ryokan Kamo River",
    JSON.stringify({
      title: "Arrive in Kyoto & Gion Lanterns",
      vibe: "✨ Serene Arrival",
      morning: { title: "Arrival & Check-in", desc: "Check into Machiya and enjoy welcome matcha.", tags: ["🍵 Welcome Tea"] },
      afternoon: { title: "Philosopher's Path", desc: "Wander along the stone canal.", tags: ["🌸 Sakura Walk"] },
      evening: { title: "Gion Lantern Walk", desc: "Kaiseki dinner overlooking Kamogawa.", tags: ["🏮 Lanterns"] }
    })
  );

  const defaultPacking = [
    { category: "clothes", text: "Comfy walking trainers / sneakers", packed: true },
    { category: "clothes", text: "3x Pastel linen tops / tees", packed: false },
    { category: "toiletries", text: "SPF 50 mineral sunscreen", packed: true },
    { category: "tech", text: "Universal travel plug adapter", packed: true },
    { category: "documents", text: "Valid Passport & Visa copies", packed: true }
  ];
  db.prepare("INSERT INTO packing (tripId, items) VALUES (?, ?)").run(tripId, JSON.stringify(defaultPacking));

  db.prepare("INSERT INTO budget (tripId, categories, amounts) VALUES (?, ?, ?)").run(
    tripId,
    JSON.stringify(["flights", "stays", "food", "activities", "shopping"]),
    JSON.stringify({ total: 150000, currency: "₹", perPerson: 75000, flights: 48000, stays: 52500, food: 27000, activities: 15000, shopping: 7500 })
  );
}

// --- HELPER: Parse JSON Body ---
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

// --- HTTP SERVER ---
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // JSON API Helper
  const sendJSON = (data, status = 200) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  };

  try {
    // 0. POST /generate-trip - Groq AI Trip Generator
    if (req.method === "POST" && pathname === "/generate-trip") {
      const b = await parseBody(req);
      const apiKey = process.env.XAI_API_KEY || process.env.GROQ_API_KEY;

      if (!apiKey || apiKey === "$$$$$") {
        return sendJSON({
          error: "XAI_API_KEY is not configured in .env (currently set to placeholder). Please add a valid Groq API key.",
          isConfigError: true
        }, 400);
      }

      const promptUser = `
Plan a trip based on these preferences:
Destination: ${b.destination || "Kyoto, Japan"}
Departure Date: ${b.depDate || "Upcoming"}
Return Date: ${b.retDate || "Upcoming"}
Duration: ${b.numDays || 5} days
Budget: ${b.budgetVal || 100000} ${b.currency || "₹"}
Travellers: ${b.travellerCount || 1} (${b.travellerType || "Solo"})
Travel Style: ${b.style || "Cultural"}
Accommodation: ${b.accommodation || "Cosy Hotel"}
Pace: ${b.pace || "Relaxed"}

Requirements:
- Day-wise city and hotel.
- Morning, afternoon, and evening activities with titles, descriptions, and tags.
- Packing checklist suggestions considering the destination and weather.
- Budget breakdown matching the total budget.
Respond ONLY with a valid JSON object matching the requested schema.
`;

      const systemPrompt = `You are TravelMate AI, an expert travel planner. You MUST respond with ONLY a valid JSON object (no markdown, no extra explanation).
Schema:
{
  "summary": {
    "title": "Title with emoji",
    "subtitle": "${b.numDays || 5} Days • ${b.travellerCount || 1} Travellers • ${b.style || 'Relaxed'}",
    "city": "${b.destination || 'City'}",
    "hotel": "${b.accommodation || 'Cosy Hotel'}",
    "pace": "${b.pace || 'Relaxed'}",
    "crew": "${b.travellerCount || 1} Travellers (${b.travellerType || 'Group'})"
  },
  "days": [
    {
      "dayNum": 1,
      "title": "Day 1 Title",
      "vibe": "✨ Day vibe",
      "hotel": "Hotel name",
      "morning": { "title": "Morning activity", "desc": "Activity description", "tags": ["tag1", "tag2"] },
      "afternoon": { "title": "Afternoon activity", "desc": "Activity description", "tags": ["tag1", "tag2"] },
      "evening": { "title": "Evening activity", "desc": "Activity description", "tags": ["tag1", "tag2"] }
    }
  ],
  "packing": [
    { "category": "clothes", "text": "Specific item (weather-aware)", "packed": false },
    { "category": "toiletries", "text": "Specific toiletry", "packed": false },
    { "category": "tech", "text": "Specific gadget / adapter", "packed": false },
    { "category": "documents", "text": "Specific essential document", "packed": false }
  ],
  "budget": {
    "total": ${Number(b.budgetVal) || 100000},
    "currency": "${b.currency || '₹'}",
    "perPerson": ${Math.round((Number(b.budgetVal) || 100000) / (Number(b.travellerCount) || 1))},
    "categories": ["flights", "stays", "food", "activities", "shopping"],
    "amounts": {
      "flights": ${Math.round((Number(b.budgetVal) || 100000) * 0.32)},
      "stays": ${Math.round((Number(b.budgetVal) || 100000) * 0.35)},
      "food": ${Math.round((Number(b.budgetVal) || 100000) * 0.18)},
      "activities": ${Math.round((Number(b.budgetVal) || 100000) * 0.10)},
      "shopping": ${Math.round((Number(b.budgetVal) || 100000) * 0.05)}
    }
  }
}`;

      // Call Groq API with retry
      let aiResult = null;
      let groqError = null;

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: "openai/gpt-oss-120b",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: promptUser }
              ],
              temperature: 0.6,
              response_format: { type: "json_object" }
            })
          });

          if (!groqRes.ok) {
            const errBody = await groqRes.text();
            throw new Error(`Groq HTTP ${groqRes.status}: ${errBody}`);
          }

          const groqData = await groqRes.json();
          const content = groqData.choices?.[0]?.message?.content;
          if (!content) throw new Error("Empty response from Groq AI");

          let cleaned = content.trim();
          if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
          }
          aiResult = JSON.parse(cleaned);
          break;
        } catch (err) {
          groqError = err;
          if (attempt < 2) await new Promise((r) => setTimeout(r, 1000));
        }
      }

      if (!aiResult) {
        return sendJSON({
          error: `Groq AI generation failed: ${groqError ? groqError.message : "Unknown error"}`,
          canRetry: true
        }, 502);
      }

      // Save structured trip to SQLite database
      const destination = aiResult.summary?.city || b.destination || "Dream Journey";
      const datesObj = { depDate: b.depDate, retDate: b.retDate, days: aiResult.days?.length || b.numDays || 5 };
      const budgetTotal = aiResult.budget?.total || Number(b.budgetVal) || 100000;
      const travellersObj = { count: Number(b.travellerCount) || 1, type: b.travellerType || "Solo" };
      const preferencesObj = { style: b.style, accommodation: aiResult.summary?.hotel || b.accommodation, pace: b.pace };

      const insertTrip = db.prepare(`
        INSERT INTO trips (destination, dates, budget, travellers, preferences)
        VALUES (?, ?, ?, ?, ?)
      `);
      const tripRes = insertTrip.run(
        destination,
        JSON.stringify(datesObj),
        budgetTotal,
        JSON.stringify(travellersObj),
        JSON.stringify(preferencesObj)
      );
      const tripId = tripRes.lastInsertRowid;

      // Save itinerary
      if (Array.isArray(aiResult.days)) {
        const insertItin = db.prepare("INSERT INTO itinerary (tripId, day, city, hotel, activities) VALUES (?, ?, ?, ?, ?)");
        aiResult.days.forEach((d) => {
          insertItin.run(
            tripId,
            d.dayNum || 1,
            destination,
            d.hotel || preferencesObj.accommodation || "",
            JSON.stringify({
              title: d.title || "",
              vibe: d.vibe || "",
              morning: d.morning || {},
              afternoon: d.afternoon || {},
              evening: d.evening || {}
            })
          );
        });
      }

      // Save packing suggestions
      const packingList = Array.isArray(aiResult.packing) && aiResult.packing.length > 0 ? aiResult.packing : [
        { category: "clothes", text: "Weather-appropriate tops & bottoms", packed: false },
        { category: "toiletries", text: "Toiletry kit & skincare", packed: false },
        { category: "tech", text: "Universal adapter & phone charger", packed: false },
        { category: "documents", text: "Passport & booking details", packed: false }
      ];
      db.prepare("INSERT INTO packing (tripId, items) VALUES (?, ?)").run(tripId, JSON.stringify(packingList));

      // Save budget
      const budgetObj = aiResult.budget || {
        total: budgetTotal,
        currency: b.currency || "₹",
        perPerson: Math.round(budgetTotal / (travellersObj.count || 1)),
        categories: ["flights", "stays", "food", "activities", "shopping"],
        amounts: {
          flights: Math.round(budgetTotal * 0.32),
          stays: Math.round(budgetTotal * 0.35),
          food: Math.round(budgetTotal * 0.18),
          activities: Math.round(budgetTotal * 0.10),
          shopping: Math.round(budgetTotal * 0.05)
        }
      };
      db.prepare("INSERT INTO budget (tripId, categories, amounts) VALUES (?, ?, ?)").run(
        tripId,
        JSON.stringify(budgetObj.categories || ["flights", "stays", "food", "activities", "shopping"]),
        JSON.stringify(budgetObj.amounts || {})
      );

      return sendJSON({
        success: true,
        tripId,
        data: {
          id: tripId,
          summary: aiResult.summary,
          destination,
          dates: datesObj,
          travellers: travellersObj,
          preferences: preferencesObj,
          budget: budgetObj,
          days: aiResult.days,
          packing: packingList
        }
      }, 201);
    }

    // 1. GET /api/trips - List all trips
    if (req.method === "GET" && pathname === "/api/trips") {
      const rows = db.prepare("SELECT * FROM trips ORDER BY id DESC").all();
      const trips = rows.map((r) => ({
        id: r.id,
        destination: r.destination,
        dates: JSON.parse(r.dates || "{}"),
        budget: r.budget,
        travellers: JSON.parse(r.travellers || "{}"),
        preferences: JSON.parse(r.preferences || "{}"),
        createdAt: r.createdAt
      }));
      return sendJSON(trips);
    }

    // 2. GET /api/trips/:id - Get trip details
    const tripMatch = pathname.match(/^\/api\/trips\/(\d+)$/);
    if (req.method === "GET" && tripMatch) {
      const id = parseInt(tripMatch[1], 10);
      const trip = db.prepare("SELECT * FROM trips WHERE id = ?").get(id);
      if (!trip) return sendJSON({ error: "Trip not found" }, 404);

      const itineraryRows = db.prepare("SELECT * FROM itinerary WHERE tripId = ? ORDER BY day ASC").all(id);
      const packingRow = db.prepare("SELECT * FROM packing WHERE tripId = ? ORDER BY id DESC LIMIT 1").get(id);
      const budgetRow = db.prepare("SELECT * FROM budget WHERE tripId = ? ORDER BY id DESC LIMIT 1").get(id);

      return sendJSON({
        id: trip.id,
        destination: trip.destination,
        dates: JSON.parse(trip.dates || "{}"),
        budget: trip.budget,
        travellers: JSON.parse(trip.travellers || "{}"),
        preferences: JSON.parse(trip.preferences || "{}"),
        itinerary: itineraryRows.map((r) => ({
          id: r.id,
          day: r.day,
          city: r.city,
          hotel: r.hotel,
          activities: JSON.parse(r.activities || "{}")
        })),
        packing: packingRow ? JSON.parse(packingRow.items || "[]") : [],
        budgetBreakdown: budgetRow ? {
          categories: JSON.parse(budgetRow.categories || "[]"),
          amounts: JSON.parse(budgetRow.amounts || "{}")
        } : null
      });
    }

    // 3. POST /api/trips - Create new trip
    if (req.method === "POST" && pathname === "/api/trips") {
      const b = await parseBody(req);
      const insertTrip = db.prepare(`
        INSERT INTO trips (destination, dates, budget, travellers, preferences)
        VALUES (?, ?, ?, ?, ?)
      `);
      const tripRes = insertTrip.run(
        b.destination || "Dream Journey",
        JSON.stringify(b.dates || {}),
        Number(b.budget) || 100000,
        JSON.stringify(b.travellers || { count: 1, type: "Solo" }),
        JSON.stringify(b.preferences || {})
      );
      const tripId = tripRes.lastInsertRowid;

      // Save itinerary days if provided
      if (Array.isArray(b.days)) {
        const insertItin = db.prepare("INSERT INTO itinerary (tripId, day, city, hotel, activities) VALUES (?, ?, ?, ?, ?)");
        b.days.forEach((d) => {
          insertItin.run(
            tripId,
            d.dayNum || d.day || 1,
            b.destination || "",
            d.hotel || (b.preferences && b.preferences.accommodation) || "",
            JSON.stringify(d.activities || {
              title: d.title || "",
              vibe: d.vibe || "",
              morning: d.morning || {},
              afternoon: d.afternoon || {},
              evening: d.evening || {}
            })
          );
        });
      }

      // Save packing items
      db.prepare("INSERT INTO packing (tripId, items) VALUES (?, ?)").run(
        tripId,
        JSON.stringify(b.packing || [])
      );

      // Save budget
      db.prepare("INSERT INTO budget (tripId, categories, amounts) VALUES (?, ?, ?)").run(
        tripId,
        JSON.stringify(b.budgetBreakdown?.categories || ["flights", "stays", "food", "activities", "shopping"]),
        JSON.stringify(b.budgetBreakdown?.amounts || {})
      );

      return sendJSON({ id: tripId, success: true }, 201);
    }

    // 4. PUT /api/trips/:id - Edit trip info
    if (req.method === "PUT" && tripMatch) {
      const id = parseInt(tripMatch[1], 10);
      const b = await parseBody(req);

      const existing = db.prepare("SELECT * FROM trips WHERE id = ?").get(id);
      if (!existing) return sendJSON({ error: "Trip not found" }, 404);

      const destination = b.destination !== undefined ? b.destination : existing.destination;
      const dates = b.dates !== undefined ? JSON.stringify(b.dates) : existing.dates;
      const budget = b.budget !== undefined ? Number(b.budget) : existing.budget;
      const travellers = b.travellers !== undefined ? JSON.stringify(b.travellers) : existing.travellers;
      const preferences = b.preferences !== undefined ? JSON.stringify(b.preferences) : existing.preferences;

      db.prepare(`
        UPDATE trips SET destination = ?, dates = ?, budget = ?, travellers = ?, preferences = ?
        WHERE id = ?
      `).run(destination, dates, budget, travellers, preferences, id);

      return sendJSON({ success: true, id });
    }

    // 5. DELETE /api/trips/:id - Delete trip
    if (req.method === "DELETE" && tripMatch) {
      const id = parseInt(tripMatch[1], 10);
      db.prepare("DELETE FROM itinerary WHERE tripId = ?").run(id);
      db.prepare("DELETE FROM packing WHERE tripId = ?").run(id);
      db.prepare("DELETE FROM budget WHERE tripId = ?").run(id);
      db.prepare("DELETE FROM trips WHERE id = ?").run(id);
      return sendJSON({ success: true, id });
    }

    // 6. PUT /api/trips/:id/packing - Update packing items
    const packMatch = pathname.match(/^\/api\/trips\/(\d+)\/packing$/);
    if (req.method === "PUT" && packMatch) {
      const id = parseInt(packMatch[1], 10);
      const b = await parseBody(req);
      const items = JSON.stringify(b.items || []);
      const existing = db.prepare("SELECT id FROM packing WHERE tripId = ?").get(id);
      if (existing) {
        db.prepare("UPDATE packing SET items = ? WHERE tripId = ?").run(items, id);
      } else {
        db.prepare("INSERT INTO packing (tripId, items) VALUES (?, ?)").run(id, items);
      }
      return sendJSON({ success: true });
    }

    // 7. PUT /api/trips/:id/budget - Update budget amounts
    const budgetMatch = pathname.match(/^\/api\/trips\/(\d+)\/budget$/);
    if (req.method === "PUT" && budgetMatch) {
      const id = parseInt(budgetMatch[1], 10);
      const b = await parseBody(req);
      const categories = JSON.stringify(b.categories || ["flights", "stays", "food", "activities", "shopping"]);
      const amounts = JSON.stringify(b.amounts || {});
      const existing = db.prepare("SELECT id FROM budget WHERE tripId = ?").get(id);
      if (existing) {
        db.prepare("UPDATE budget SET categories = ?, amounts = ? WHERE tripId = ?").run(categories, amounts, id);
      } else {
        db.prepare("INSERT INTO budget (tripId, categories, amounts) VALUES (?, ?, ?)").run(id, categories, amounts);
      }
      return sendJSON({ success: true });
    }

    // --- STATIC FILE SERVING ---
    let filePath = path.join(__dirname, pathname === "/" ? "index.html" : pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".svg": "image/svg+xml"
      };
      res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    sendJSON({ error: "Not Found" }, 404);
  } catch (err) {
    console.error("Server error:", err);
    sendJSON({ error: err.message }, 500);
  }
});

server.listen(PORT, () => {
  console.log(`TravelMate backend listening on http://localhost:${PORT}`);
});
