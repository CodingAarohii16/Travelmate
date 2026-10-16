/* ==========================================================================
   TRAVELMATE - INTERACTIVE JAVASCRIPT CONTROLLER
   Pure Vanilla JS: Navigation, Forms, Tabs, Itinerary Generator,
   Packing List, Budget Calculator & Scrapbook Storage.
   ========================================================================== */

// --- SAMPLE ITINERARY REPOSITORIES ---
const sampleItineraries = {
  kyoto: {
    title: "Kyoto & Uji Dream Days 🌸",
    subtitle: "7 Days • 2 Travellers • Cultural & Relaxed",
    city: "Kyoto, Japan",
    hotel: "Machiya Ryokan Kamo River",
    pace: "Relaxed (Slow travel, cafe pauses)",
    crew: "2 Travellers (Couple)",
    currency: "₹",
    budget: 150000,
    days: [
      {
        dayNum: 1,
        title: "Arrive in Kyoto & Gion Lanterns",
        vibe: "✨ Serene Arrival",
        hotel: "Machiya Ryokan Kamo River • Traditional Tatami Suites",
        morning: {
          title: "Arrival, Matcha Latte & Ryokan Check-in",
          desc: "Arrive via Haruka express, drop luggage at your Machiya, pick up regional transit cards, and sip a warm ceremonial matcha tea.",
          tags: ["🍵 Welcome Tea", "🧳 Luggage Drop", "🚆 Haruka Train"]
        },
        afternoon: {
          title: "Philosopher’s Path & Ginkaku-ji Gardens",
          desc: "Wander leisurely along the quiet stone canal flanked by cherry blossoms, peek into ceramic artisan studios, and visit the silver pavilion.",
          tags: ["🌸 Sakura Walk", "📸 Polaroid Spots", "🏺 Artisan Pottery"]
        },
        evening: {
          title: "Gion Lantern Walk & Riverside Kaiseki",
          desc: "Stroll cobblestone alleys illuminated by soft paper lanterns. Enjoy an 8-course seasonal Kaiseki dinner overlooking the tranquil Kamogawa river.",
          tags: ["🏮 Paper Lanterns", "🥢 Kaiseki Dining", "🌌 Night Walk"]
        }
      },
      {
        dayNum: 2,
        title: "Arashiyama Bamboo & River Boat",
        vibe: "🎋 Emerald Wonder",
        hotel: "Machiya Ryokan Kamo River",
        morning: {
          title: "Sagano Bamboo Grove & Tenryu-ji Temple",
          desc: "Beat the morning crowds at 8:00 AM in the soaring emerald bamboo forest, then explore Tenryu-ji's UNESCO zen landscape garden.",
          tags: ["🎋 Bamboo Forest", "🧘 Zen Garden", "🕊️ Early Bird"]
        },
        afternoon: {
          title: "Togetsukyo Bridge & Matcha Parfait Cafe",
          desc: "Cross the historic wooden bridge, observe wild river herons, and pause at % Arabica coffee kiosk or a classic Uji green tea cafe.",
          tags: ["☕ Craft Coffee", "🍡 Dango Treats", "🛶 Wooden Bridge"]
        },
        evening: {
          title: "Romantic Hozugawa Boat Cruise & Soba Dinner",
          desc: "Hop aboard a scenic wooden boat gently guided down river rapids. Savor freshly ground handmade buckwheat soba for dinner.",
          tags: ["🍜 Handmade Soba", "⛵ River Drift"]
        }
      },
      {
        dayNum: 3,
        title: "Fushimi Inari Torii Gates & Sake District",
        vibe: "⛩️ Sacred Crimson",
        hotel: "Machiya Ryokan Kamo River",
        morning: {
          title: "Hike Through 10,000 Vermilion Torii Gates",
          desc: "Climb through the iconic red wooden tunnels under mountain cedars. Stop by hillside fox shrines and pick up wooden wish plaques.",
          tags: ["⛩️ Torii Gates", "🦊 Kitsune Shrine", "👟 Forest Hike"]
        },
        afternoon: {
          title: "Fushimi Sake Breweries & Canal Willows",
          desc: "Explore historic Edo-era wooden breweries along willow-lined canals. Enjoy light tastings of sweet filtered and unfiltered junmai sakes.",
          tags: ["🍶 Sake Tasting", "🌿 Weeping Willows", "🪵 Edo Architecture"]
        },
        evening: {
          title: "Pontocho Alley Yakitori & Dessert Crepes",
          desc: "Dine on sizzling yakitori skewers in atmospheric narrow laneways, followed by Japanese strawberry crepes from an artisan stall.",
          tags: ["🍢 Yakitori", "🍓 Sweet Crepes", "🏮 Cozy Alley"]
        }
      },
      {
        dayNum: 4,
        title: "Uji Green Tea Capital Day Trip",
        vibe: "🍵 Matcha Heaven",
        hotel: "Machiya Ryokan Kamo River",
        morning: {
          title: "Byodoin Temple & Phoenix Hall",
          desc: "Take a 20-minute local train to Uji. Gaze upon the iconic Phoenix Hall mirrored in the lotus pond, celebrated on Japan's 10-yen coin.",
          tags: ["🪷 Phoenix Hall", "🪙 10-Yen Landmark", "🦆 Lotus Lake"]
        },
        afternoon: {
          title: "Traditional Matcha Grinding Workshop",
          desc: "Grind hand-picked tencha leaves on a heavy granite stone mill, then whisk your own frothy bowl accompanied by seasonal wagashi bean sweets.",
          tags: ["🍵 Whisking Class", "🍡 Wagashi Art", "🌿 Herb Garden"]
        },
        evening: {
          title: "Return to Kyoto & Onsen Bath Soak",
          desc: "Head back to Kyoto for a restful evening dip in natural cedar hot spring waters scented with fresh seasonal yuzu citrus.",
          tags: ["♨️ Onsen Soak", "🍊 Yuzu Aromas", "💤 Deep Rest"]
        }
      },
      {
        dayNum: 5,
        title: "Kiyomizu-dera & Antique Hunting",
        vibe: "🎐 Wooden Wonders",
        hotel: "Machiya Ryokan Kamo River",
        morning: {
          title: "Kiyomizu-dera Wooden Stage & Spring Water",
          desc: "Stand high on the 13-meter timber balcony overlooking maple trees. Drink sweet water from the Otowa Waterfall using long cups.",
          tags: ["🏯 Timber Stage", "💧 Sacred Spring", "🍁 Maple Vistas"]
        },
        afternoon: {
          title: "Sannenzaka Teahouses & Vintage Kimono Shops",
          desc: "Browse charming preserved wooden machiya shops for vintage tenugui towels, washi stationery, and sesame ice cream.",
          tags: ["🛍️ Washi Paper", "🍦 Sesame Gelato", "🎎 Wooden Houses"]
        },
        evening: {
          title: "Farewell Sukiyaki Dinner & Scrapbook Writing",
          desc: "Indulge in thinly sliced marbled beef sukiyaki simmered with scallions and tofu. Tape day-ticket stubs into your travel scrapbook.",
          tags: ["🍲 Sukiyaki Pot", "📖 Scrapbook Hour", "💖 Sweet Memories"]
        }
      }
    ]
  },

  santorini: {
    title: "Santorini & Oia Golden Hour 🍋",
    subtitle: "6 Days • Couple • Romantic Getaway",
    city: "Santorini, Greece",
    hotel: "Canaves Oia Cave Suites",
    pace: "Relaxed (Slow travel, cafe pauses)",
    crew: "2 Travellers (Couple)",
    currency: "€",
    budget: 2400,
    days: [
      {
        dayNum: 1,
        title: "Arrival in Fira & Caldera Sunset",
        vibe: "🌊 Aegean Blue",
        hotel: "Canaves Oia Cliffside Suites",
        morning: {
          title: "Check-in to White-Washed Cave Suite",
          desc: "Unpack in your sunlit cliff cave suite with private infinity plunge pool overlooking the volcanic caldera.",
          tags: ["🤍 Cave Suite", "🌊 Caldera Views", "🥂 Welcome Ouzo"]
        },
        afternoon: {
          title: "Wander Cobblestone Alleys of Fira",
          desc: "Explore blue-domed chapels, jewelry boutiques, and cozy cafes serving freshly squeezed orange juice.",
          tags: ["⛪ Blue Domes", "🍊 Citrus Spritz", "📸 Clifftop Walk"]
        },
        evening: {
          title: "Seafood Meze & Greek Salad Dinner",
          desc: "Savor grilled calamari, local cherry tomatoes, barrel-aged feta, and crisp Assyrtiko white wine.",
          tags: ["🐙 Fresh Calamari", "🧀 Greek Feta", "🍷 Assyrtiko Wine"]
        }
      },
      {
        dayNum: 2,
        title: "Catamaran Sailing & Red Beach",
        vibe: "⛵ Salt & Sunshine",
        hotel: "Canaves Oia Cliffside Suites",
        morning: {
          title: "Catamaran Cruise Around Caldera",
          desc: "Board a luxury catamaran. Sail past the dramatic volcanic hot springs and towering Red Beach cliffs.",
          tags: ["⛵ Sailing Boat", "🏊 Snorkeling", "🌋 Volcanic Springs"]
        },
        afternoon: {
          title: "On-Board BBQ Lunch & Swimming",
          desc: "Anchor in a quiet bay for grilled Greek souvlaki, tzatziki, pita bread, and swimming in crystal water.",
          tags: ["🍢 Souvlaki BBQ", "🏊 Turquoise Waters"]
        },
        evening: {
          title: "Watch the Famous Oia Castle Sunset",
          desc: "Climb up to the Byzantine castle ruins for the iconic sunset as the sky turns apricot, lilac, and rose.",
          tags: ["🌅 Oia Sunset", "📸 Polaroid Heaven", "✨ Magic Hour"]
        }
      },
      {
        dayNum: 3,
        title: "Pyrgos Village & Wine Tasting",
        vibe: "🍇 Vineyards & Castle",
        hotel: "Canaves Oia Cliffside Suites",
        morning: {
          title: "Quiet Morning in Medieval Pyrgos",
          desc: "Stroll away from tourists in this hilltop medieval village with winding stone labyrinths and sleepy cats.",
          tags: ["🏰 Medieval Castle", "🐱 Island Cats", "☕ Greek Coffee"]
        },
        afternoon: {
          title: "Santos Winery Clifftop Flight",
          desc: "Sample 6 volcanic wine varieties paired with local cheeses and caper leaves overlooking panoramic cliffs.",
          tags: ["🍷 Wine Flight", "🧀 Artisan Cheeses", "🍇 Vineyards"]
        },
        evening: {
          title: "Candlelit Cliffside Dinner",
          desc: "Dine under stars at a romantic terrace with live acoustic bouzouki guitar melodies.",
          tags: ["🕯️ Candlelight", "🎸 Bouzouki Music", "🌌 Starry Sky"]
        }
      }
    ]
  },

  bali: {
    title: "Ubud Jungle & Coastal Waves 🥥",
    subtitle: "7 Days • Solo Explorer • Adventure & Serenity",
    city: "Bali, Indonesia",
    hotel: "Bisma Eight Bamboo Jungle Villa",
    pace: "Balanced (Best highlights + downtime)",
    crew: "Solo Explorer",
    currency: "$",
    budget: 1200,
    days: [
      {
        dayNum: 1,
        title: "Arrival in Ubud & Organic Cafe",
        vibe: "🌿 Tropical Welcome",
        hotel: "Bisma Eight Bamboo Jungle Villa",
        morning: {
          title: "Airport Transfer to Ubud & Fruit Bowl",
          desc: "Arrive in Ubud amidst singing cicadas and emerald jungle canopy. Check in and enjoy a dragonfruit smoothie bowl.",
          tags: ["🥥 Coconut Bowl", "🌿 Bamboo Villa", "🌺 Frangipani"]
        },
        afternoon: {
          title: "Campuhan Ridge Nature Walk",
          desc: "Hike along the lush ridge between two rushing river valleys with sweeping views of palm trees and elephant grass.",
          tags: ["🚶 Scenic Trail", "🌴 Palm Vistas", "📸 Photo Walk"]
        },
        evening: {
          title: "Balinese Traditional Massage & Nasi Goreng",
          desc: "Relax with a 90-minute warm coconut oil herbal spa treatment, followed by authentic chicken satay nasi goreng.",
          tags: ["🧖 Spa Treatment", "🥥 Coconut Oil", "🍛 Nasi Goreng"]
        }
      },
      {
        dayNum: 2,
        title: "Tegalalang Rice Terraces & Waterfall",
        vibe: "💦 Cascades & Terraces",
        hotel: "Bisma Eight Bamboo Jungle Villa",
        morning: {
          title: "Sunrise at Tegalalang Rice Terraces",
          desc: "Walk through morning mist across stepped green rice terraces. Experience the iconic jungle giant swing.",
          tags: ["🌾 Rice Paddies", "🌅 Sunrise Mist", "🎋 Jungle Swing"]
        },
        afternoon: {
          title: "Tibumana Hidden Waterfall Dip",
          desc: "Descend into a hidden jungle cove to swim under the cooling spray of Tibumana's pristine cascade.",
          tags: ["💦 Secret Waterfall", "🏊 Natural Pool", "🌿 Fern Forest"]
        },
        evening: {
          title: "Ubud Palace Traditional Dance & Night Market",
          desc: "Watch the intricate Legong dance performance at the royal palace, followed by warm banana fritters at Gianyar market.",
          tags: ["💃 Legong Dance", "🍌 Pisang Goreng", "🏮 Night Market"]
        }
      }
    ]
  }
};

// Global Current Active Trip State
let currentTripData = sampleItineraries.kyoto;
let activeDayIndex = 0;

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", async () => {
  setupNavigation();
  setupPlannerDates();
  setupFormListener();

  if (window.TravelMateDB) {
    try {
      await TravelMateDB.init();
      const savedTrips = await TravelMateDB.getAllTrips();
      if (savedTrips && savedTrips.length > 0) {
        // Load the latest trip
        const latest = savedTrips[savedTrips.length - 1];
        savedTrips.forEach(t => addNewTripToMemoryGrid(t));
        await loadTripFromDB(latest.id);
      } else {
        // Seed default initial trip into persistent DB
        const packingItems = getPackingItemsFromUI();
        const initialId = await TravelMateDB.saveTrip({
          destination: currentTripData.city,
          dates: { depDate: "2026-04-10", retDate: "2026-04-16", days: 7 },
          budget: currentTripData.budget,
          travellers: { count: 2, type: "Couple" },
          preferences: { style: "Cultural & Relaxed", accommodation: currentTripData.hotel, pace: currentTripData.pace },
          days: currentTripData.days,
          packingItems,
          budgetData: {
            total: currentTripData.budget,
            currency: currentTripData.currency,
            flights: Math.round(currentTripData.budget * 0.32),
            stays: Math.round(currentTripData.budget * 0.35),
            food: Math.round(currentTripData.budget * 0.18),
            activities: Math.round(currentTripData.budget * 0.10),
            shopping: Math.round(currentTripData.budget * 0.05)
          }
        });
        currentTripData.id = initialId;
      }
    } catch (err) {
      console.warn("DB init warning:", err);
    }
  }

  renderItinerary();
  updatePackingProgress();
  calculateBudgetBreakdown(currentTripData.budget, currentTripData.currency);
});

// --- NAVIGATION SYSTEM ---
function setupNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const menuToggle = document.getElementById("menuToggle");
  const navBar = document.querySelector(".nav-bar");

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("data-target");
      showSection(target);
      if (navBar.classList.contains("mobile-open")) {
        navBar.classList.remove("mobile-open");
      }
    });
  });

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navBar.classList.toggle("mobile-open");
    });
  }
}

function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll(".page-section");
  sections.forEach(sec => sec.classList.remove("active"));

  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active");
  }

  // Update active nav link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    if (link.getAttribute("data-target") === sectionId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Scroll gently to top of content
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- PLANNER FORM SETUP & DEFAULTS ---
function setupPlannerDates() {
  const depInput = document.getElementById("departureDate");
  const retInput = document.getElementById("returnDate");

  if (!depInput || !retInput) return;

  const today = new Date();
  const depart = new Date();
  depart.setDate(today.getDate() + 14);

  const returning = new Date();
  returning.setDate(today.getDate() + 21);

  depInput.value = depart.toISOString().split("T")[0];
  retInput.value = returning.toISOString().split("T")[0];
}

function stepTravellers(delta) {
  const input = document.getElementById("travellerCount");
  if (!input) return;
  let val = parseInt(input.value) || 1;
  val = Math.max(1, Math.min(25, val + delta));
  input.value = val;
}

function resetForm() {
  const form = document.getElementById("planTripForm");
  if (form) form.reset();
  setupPlannerDates();
  showToast("Form cleared! Ready for fresh dream notes ✨");
}

function setupFormListener() {
  const form = document.getElementById("planTripForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dest = document.getElementById("destination").value.trim();
    const depDate = document.getElementById("departureDate").value;
    const retDate = document.getElementById("returnDate").value;
    const currency = document.getElementById("budgetCurrency").value;
    const budgetVal = parseFloat(document.getElementById("tripBudget").value) || 100000;
    const travellerType = document.getElementById("travellerType").value;
    const travellerCount = parseInt(document.getElementById("travellerCount").value) || 1;
    const style = document.getElementById("travelStyle").value;
    const accommodation = document.getElementById("accommodation").value;
    const paceRadio = document.querySelector('input[name="tripPace"]:checked');
    const pace = paceRadio ? paceRadio.value : "Relaxed";

    // Calculate days duration
    const start = new Date(depDate);
    const end = new Date(retDate);
    const timeDiff = end.getTime() - start.getTime();
    let numDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (numDays < 1) numDays = 1;
    if (numDays > 14) numDays = 14;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : "";

    // Clear previous error
    hideFormError();

    // Loading State
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>✨ Crafting with Groq AI...</span>`;
    }

    try {
      const response = await fetch("/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: dest,
          depDate,
          retDate,
          numDays,
          currency,
          budgetVal,
          travellerType,
          travellerCount,
          style,
          accommodation,
          pace
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({ error: "Server response error." }));
        throw new Error(errJson.error || `HTTP ${response.status} error`);
      }

      const resData = await response.json();
      if (!resData.success || !resData.data) {
        throw new Error(resData.error || "Invalid response from AI generator");
      }

      const aiData = resData.data;

      // Update currentTripData from Groq AI output
      currentTripData = {
        id: resData.tripId,
        title: aiData.summary?.title || `${dest} Scrapbook Days ✨`,
        subtitle: aiData.summary?.subtitle || `${numDays} Days • ${travellerCount} Travellers • ${style}`,
        city: aiData.destination || dest,
        hotel: aiData.summary?.hotel || accommodation,
        pace: aiData.summary?.pace || pace,
        crew: aiData.summary?.crew || `${travellerCount} Travellers (${travellerType})`,
        crewCount: travellerCount,
        currency: aiData.budget?.currency || currency,
        budget: aiData.budget?.total || budgetVal,
        days: aiData.days || [],
        depDate,
        retDate
      };

      // Also persist to IndexedDB if available
      if (window.TravelMateDB) {
        TravelMateDB.saveTrip({
          destination: dest,
          dates: { depDate, retDate, days: numDays },
          budget: budgetVal,
          travellers: { count: travellerCount, type: travellerType },
          preferences: { style, accommodation, pace },
          days: currentTripData.days,
          packingItems: aiData.packing || getPackingItemsFromUI(),
          budgetData: aiData.budget || {
            total: budgetVal,
            currency,
            flights: Math.round(budgetVal * 0.32),
            stays: Math.round(budgetVal * 0.35),
            food: Math.round(budgetVal * 0.18),
            activities: Math.round(budgetVal * 0.10),
            shopping: Math.round(budgetVal * 0.05)
          }
        }).catch(() => {});
      }

      // Add trip to My Trips memory album
      addNewTripToMemoryGrid(currentTripData);

      // Sync budget UI
      syncBudgetToTrip(currentTripData.budget, currentTripData.currency, currentTripData.crewCount);

      // Render AI-crafted itinerary
      activeDayIndex = 0;
      renderItinerary();

      // Render AI-crafted packing list
      if (aiData.packing && aiData.packing.length) {
        renderPackingItems(aiData.packing);
      }
      updatePackingProgress();

      // Show toast & switch to itinerary view
      showToast(`✨ Groq AI crafted your dream journey to "${dest}"! 🌸`);
      showSection("itinerary");

    } catch (err) {
      console.error("Trip generation error:", err);
      showFormError(err.message || "Failed to generate trip with Groq AI.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });
}

function showFormError(message) {
  let banner = document.getElementById("formErrorBanner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "formErrorBanner";
    banner.style.cssText = "background: #fff0f3; border: 1.5px solid #ffccd5; color: #c9184a; padding: 12px 16px; border-radius: 12px; margin-top: 15px; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between; gap: 12px;";
    const formActions = document.querySelector(".form-actions");
    if (formActions) formActions.parentNode.insertBefore(banner, formActions.nextSibling);
  }
  banner.innerHTML = `
    <div>
      <strong>⚠️ AI Generation Notice:</strong>
      <div style="font-size: 0.85rem; margin-top: 2px;">${escapeHtml(message)}</div>
    </div>
    <button type="button" class="btn-primary btn-sm" onclick="retryTripGeneration()" style="white-space: nowrap; padding: 6px 12px; font-size: 0.85rem;">🔄 Retry</button>
  `;
}

function hideFormError() {
  const banner = document.getElementById("formErrorBanner");
  if (banner) banner.remove();
}

function retryTripGeneration() {
  hideFormError();
  const form = document.getElementById("planTripForm");
  if (form) {
    form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  }
}

// Generate rich, responsive mock itinerary data based on user input
function generateDynamicTrip(p) {
  const daysList = [];

  const activityIdeas = [
    {
      title: `${p.dest} Arrival & Welcome Refreshment`,
      desc: `Check into ${p.accommodation}, unpack comfy clothes, and enjoy a relaxed stroll to orient yourself.`,
      tags: ["🧳 Check-in", "☕ Welcome Drink", "📍 Neighborhood Walk"]
    },
    {
      title: `Historic Highlights & Secret Old Quarters`,
      desc: `Explore top landmarks matching your ${p.style} interest with plenty of pauses for photo journaling.`,
      tags: ["🏛️ Cultural Icons", "📸 Polaroid Moments", "✨ Scenic Alley"]
    },
    {
      title: `Artisanal Morning Market & Local Delicacies`,
      desc: `Bite into fresh street delicacies and browse locally handcrafted souvenirs, textiles, and postcard prints.`,
      tags: ["🍜 Local Flavors", "🛍️ Handcrafted", "☀️ Morning Sun"]
    },
    {
      title: `Nature & Panoramic Skyline Breath`,
      desc: `Scenic viewpoint stroll followed by relaxing downtime under leafy shade trees to keep your pace ${p.pace.split(' ')[0]}.`,
      tags: ["🌿 Lush Greenery", "🌄 Golden View", "🕊️ Quiet Pause"]
    },
    {
      title: `Charming Sunset Promenade & Celebration Dinner`,
      desc: `A memorable evening celebration meal tasting local specialties with your ${p.travellerType} crew.`,
      tags: ["🕯️ Ambient Dinner", "🍷 Local Toast", "🌌 Starry Night"]
    }
  ];

  for (let i = 1; i <= Math.min(p.numDays, 7); i++) {
    const actIdx = (i - 1) % activityIdeas.length;
    const nextIdx = i % activityIdeas.length;
    const evIdx = (i + 1) % activityIdeas.length;

    daysList.push({
      dayNum: i,
      title: `Day ${i}: ${p.dest} Exploration & Moments`,
      vibe: i === 1 ? "✨ Warm Arrival" : (i === p.numDays ? "💖 Cherished Memories" : "🌸 Adventure & Bliss"),
      hotel: `${p.accommodation} • Cosy Base`,
      morning: {
        title: `Morning: ${activityIdeas[actIdx].title}`,
        desc: activityIdeas[actIdx].desc,
        tags: activityIdeas[actIdx].tags
      },
      afternoon: {
        title: `Afternoon: ${activityIdeas[nextIdx].title}`,
        desc: activityIdeas[nextIdx].desc,
        tags: activityIdeas[nextIdx].tags
      },
      evening: {
        title: `Evening: ${activityIdeas[evIdx].title}`,
        desc: activityIdeas[evIdx].desc,
        tags: activityIdeas[evIdx].tags
      }
    });
  }

  return {
    title: `${p.dest} Scrapbook Days ✨`,
    subtitle: `${p.numDays} Days • ${p.travellerCount} ${p.travellerCount === 1 ? 'Person' : 'People'} • ${p.style}`,
    city: p.dest,
    hotel: p.accommodation,
    pace: p.pace,
    crew: `${p.travellerCount} Travellers (${p.travellerType})`,
    crewCount: p.travellerCount,
    currency: p.currency,
    budget: p.budgetVal,
    days: daysList,
    depDate: p.depDate,
    retDate: p.retDate
  };
}

// --- RENDER ITINERARY VIEW ---
function renderItinerary() {
  const data = currentTripData;
  if (!data || !data.days || data.days.length === 0) return;

  // Header and Meta
  document.getElementById("itineraryTitle").innerText = data.title;
  document.getElementById("itinerarySubtitle").innerText = data.subtitle;
  document.getElementById("itinCity").innerText = data.city;
  document.getElementById("itinHotel").innerText = data.hotel;
  document.getElementById("itinPace").innerText = data.pace;
  document.getElementById("itinCrew").innerText = data.crew;

  // Render Day Tabs
  const dayTabsContainer = document.getElementById("dayTabsList");
  dayTabsContainer.innerHTML = "";

  data.days.forEach((day, index) => {
    const btn = document.createElement("button");
    btn.className = `day-tab ${index === activeDayIndex ? "active" : ""}`;
    btn.innerText = `Day ${day.dayNum} 🌸`;
    btn.onclick = () => {
      activeDayIndex = index;
      renderCurrentDayDetails();
      updateActiveTabVisuals();
    };
    dayTabsContainer.appendChild(btn);
  });

  renderCurrentDayDetails();
}

function updateActiveTabVisuals() {
  const tabs = document.querySelectorAll(".day-tab");
  tabs.forEach((tab, idx) => {
    if (idx === activeDayIndex) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
}

function renderCurrentDayDetails() {
  const day = currentTripData.days[activeDayIndex];
  if (!day) return;

  document.getElementById("currentDayBadge").innerText = `Day ${day.dayNum} of ${currentTripData.days.length}`;
  document.getElementById("currentDayTitle").innerText = day.title;
  document.getElementById("currentDayVibe").innerText = day.vibe;
  document.getElementById("currentDayHotel").innerText = day.hotel;

  // Morning
  document.getElementById("morningActivity").innerText = day.morning.title;
  document.getElementById("morningDesc").innerText = day.morning.desc;
  renderTags("morningActivity", day.morning.tags);

  // Afternoon
  document.getElementById("afternoonActivity").innerText = day.afternoon.title;
  document.getElementById("afternoonDesc").innerText = day.afternoon.desc;
  renderTags("afternoonActivity", day.afternoon.tags);

  // Evening
  document.getElementById("eveningActivity").innerText = day.evening.title;
  document.getElementById("eveningDesc").innerText = day.evening.desc;
  renderTags("eveningActivity", day.evening.tags);

  // Prev / Next button states
  const prevBtn = document.getElementById("btnPrevDay");
  const nextBtn = document.getElementById("btnNextDay");
  if (prevBtn) prevBtn.disabled = activeDayIndex === 0;
  if (nextBtn) nextBtn.disabled = activeDayIndex === currentTripData.days.length - 1;
}

function renderTags(elementId, tags) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const parent = el.closest(".block-body");
  if (!parent) return;
  const tagContainer = parent.querySelector(".block-tags");
  if (!tagContainer) return;

  tagContainer.innerHTML = "";
  tags.forEach(tag => {
    const span = document.createElement("span");
    span.className = "tag-pill";
    span.innerText = tag;
    tagContainer.appendChild(span);
  });
}

function switchDay(direction) {
  const newIndex = activeDayIndex + direction;
  if (newIndex >= 0 && newIndex < currentTripData.days.length) {
    activeDayIndex = newIndex;
    renderCurrentDayDetails();
    updateActiveTabVisuals();
  }
}

// Load pre-configured sample trips
function loadSampleTrip(key) {
  if (sampleItineraries[key]) {
    currentTripData = sampleItineraries[key];
    activeDayIndex = 0;
    renderItinerary();
    syncBudgetToTrip(currentTripData.budget, currentTripData.currency, 2);
    showToast(`Loaded ${currentTripData.city} scrapbook itinerary! ✨`);
    showSection("itinerary");
  }
}

// Quick fill destination from gallery
function quickFillDestination(destName, style) {
  showSection("plan");
  document.getElementById("destination").value = destName;
  if (style) {
    document.getElementById("travelStyle").value = style;
  }
  showToast(`Destination set to ${destName}! Choose your dates 📅`);
}

// --- PACKING LIST CHECKLIST & PROGRESS ---
function updatePackingProgress() {
  const allCheckboxes = document.querySelectorAll(".check-item input[type='checkbox']");
  const total = allCheckboxes.length;
  let packed = 0;

  allCheckboxes.forEach(cb => {
    if (cb.checked) packed++;
  });

  const countDisplay = document.getElementById("packedCount");
  const totalDisplay = document.getElementById("totalItemsCount");
  const fill = document.getElementById("packingProgressFill");

  if (countDisplay) countDisplay.innerText = packed;
  if (totalDisplay) totalDisplay.innerText = total;

  if (fill) {
    const pct = total === 0 ? 0 : Math.round((packed / total) * 100);
    fill.style.width = `${pct}%`;
  }

  // Persist packing items to DB
  if (currentTripData && currentTripData.id && window.TravelMateDB) {
    TravelMateDB.savePacking(currentTripData.id, getPackingItemsFromUI()).catch(e => {});
  }
}

function getPackingItemsFromUI() {
  const items = [];
  const categories = ['clothes', 'toiletries', 'tech', 'documents'];
  categories.forEach(cat => {
    const list = document.getElementById(`list-${cat}`);
    if (list) {
      list.querySelectorAll('li').forEach(li => {
        const checkbox = li.querySelector('input[type="checkbox"]');
        const span = li.querySelector('span');
        if (checkbox && span) {
          items.push({
            category: cat,
            text: span.innerText.trim(),
            packed: checkbox.checked
          });
        }
      });
    }
  });
  return items;
}

function renderPackingItems(items) {
  if (!items || !items.length) return;
  const categories = ['clothes', 'toiletries', 'tech', 'documents'];
  categories.forEach(cat => {
    const list = document.getElementById(`list-${cat}`);
    if (list) list.innerHTML = '';
  });
  items.forEach(item => {
    const list = document.getElementById(`list-${item.category}`);
    if (list) {
      const li = document.createElement("li");
      li.innerHTML = `
        <label class="check-item">
          <input type="checkbox" ${item.packed ? "checked" : ""} onchange="updatePackingProgress()">
          <span>${escapeHtml(item.text)}</span>
        </label>
      `;
      list.appendChild(li);
    }
  });
}

function resetPackingList() {
  const allCheckboxes = document.querySelectorAll(".check-item input[type='checkbox']");
  allCheckboxes.forEach(cb => cb.checked = false);
  updatePackingProgress();
  showToast("Suitcase checklist reset! Happy packing 🧳");
}

function addCustomPackingItem() {
  const input = document.getElementById("newPackingItemInput");
  const catSelect = document.getElementById("newPackingCategory");
  const itemName = input.value.trim();

  if (!itemName) {
    alert("Please write the cute item you want to pack!");
    return;
  }

  const categoryId = `list-${catSelect.value}`;
  const targetList = document.getElementById(categoryId);

  if (targetList) {
    const li = document.createElement("li");
    li.innerHTML = `
      <label class="check-item">
        <input type="checkbox" onchange="updatePackingProgress()">
        <span>${escapeHtml(itemName)}</span>
      </label>
    `;
    targetList.appendChild(li);
    input.value = "";
    updatePackingProgress();
    showToast(`Added "${itemName}" with a cute sticker! ✨`);
  }
}

// --- BUDGET CALCULATOR ---
function handleBudgetSlider(val) {
  const curr = document.getElementById("budgetCurrencySelect").value;
  calculateBudgetBreakdown(parseFloat(val), curr);
}

function handleBudgetCurrencyChange(curr) {
  const sliderVal = parseFloat(document.getElementById("budgetSlider").value);
  calculateBudgetBreakdown(sliderVal, curr);
}

function setQuickBudget(amt) {
  const slider = document.getElementById("budgetSlider");
  slider.value = amt;
  const curr = document.getElementById("budgetCurrencySelect").value;
  calculateBudgetBreakdown(amt, curr);
}

function syncBudgetToTrip(amt, curr, people = 2) {
  const symbol = curr || "₹";
  const select = document.getElementById("budgetCurrencySelect");
  if (select) select.value = symbol;

  const slider = document.getElementById("budgetSlider");
  if (slider) {
    slider.max = Math.max(slider.max, amt * 1.5);
    slider.value = amt;
  }

  calculateBudgetBreakdown(amt, symbol, people);
}

function calculateBudgetBreakdown(total, currency = "₹", people = 2) {
  const flights = Math.round(total * 0.32);
  const stays = Math.round(total * 0.35);
  const food = Math.round(total * 0.18);
  const activities = Math.round(total * 0.10);
  const shopping = Math.round(total * 0.05);

  document.getElementById("budgetCurrencySymbol").innerText = currency;
  document.getElementById("budgetTotalDisplay").innerText = formatNum(total);

  const perPerson = Math.round(total / (people || 2));
  document.getElementById("budgetPerPerson").innerText = `${currency}${formatNum(perPerson)}`;

  document.getElementById("valFlights").innerText = `${currency}${formatNum(flights)}`;
  document.getElementById("valStays").innerText = `${currency}${formatNum(stays)}`;
  document.getElementById("valFood").innerText = `${currency}${formatNum(food)}`;
  document.getElementById("valActivities").innerText = `${currency}${formatNum(activities)}`;
  document.getElementById("valShopping").innerText = `${currency}${formatNum(shopping)}`;

  // Persist budget to DB
  if (currentTripData && currentTripData.id && window.TravelMateDB) {
    TravelMateDB.saveBudget(currentTripData.id, {
      total,
      currency,
      perPerson,
      flights,
      stays,
      food,
      activities,
      shopping
    }).catch(e => {});
  }
}

function formatNum(num) {
  return Number(num).toLocaleString('en-US');
}

// --- MY TRIPS DYNAMIC ADDITION ---
function addNewTripToMemoryGrid(trip) {
  const container = document.getElementById("myTripsContainer");
  if (!container) return;

  // Avoid duplicate card if already rendered
  if (trip.id && container.querySelector(`[data-trip-id="${trip.id}"]`)) return;

  const card = document.createElement("div");
  card.className = "trip-polaroid-card";
  if (trip.id) card.setAttribute("data-trip-id", trip.id);

  const defaultImages = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80"
  ];
  const randomImg = defaultImages[Math.floor(Math.random() * defaultImages.length)];
  const cityName = trip.destination || trip.city || 'Dream';
  const depDateText = (trip.dates && trip.dates.depDate) ? trip.dates.depDate : (trip.depDate || 'Saved in DB');
  const crewText = trip.travellers ? `${trip.travellers.count || 2} Travellers (${trip.travellers.type || 'Trip'})` : (trip.crew || '2 Travellers');
  const paceText = (trip.preferences && trip.preferences.pace) || trip.pace || 'Relaxed';
  const hotelText = (trip.preferences && trip.preferences.accommodation) || trip.hotel || 'Cosy Base';
  const currencySymbol = trip.currency || '₹';

  card.innerHTML = `
    <div class="tape-strip mint-tape"></div>
    <div class="trip-img-wrap">
      <img src="${randomImg}" alt="${escapeHtml(cityName)}">
      <span class="trip-badge badge-active">Active Plan 🌸</span>
    </div>
    <div class="trip-card-content">
      <div class="trip-dates-tag">📅 ${depDateText}</div>
      <h3 class="trip-name">${escapeHtml(cityName)} Journey</h3>
      <p class="trip-desc">${escapeHtml(crewText)} • ${escapeHtml(paceText)} • ${escapeHtml(hotelText)}</p>
      <div class="trip-card-footer">
        <span class="trip-cost">${currencySymbol}${formatNum(trip.budget)}</span>
        <button class="btn-secondary btn-sm" onclick="${trip.id ? `loadTripFromDB(${trip.id})` : `showSection('itinerary')`}">Open Itinerary</button>
      </div>
    </div>
  `;

  // Prepend to top of container
  container.insertBefore(card, container.firstChild);
}

// Load a trip from persistent DB into active view
async function loadTripFromDB(tripId) {
  if (!window.TravelMateDB) return;
  const trips = await TravelMateDB.getAllTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return;

  const itinDays = await TravelMateDB.getItinerary(tripId);
  const packing = await TravelMateDB.getPacking(tripId);
  const budget = await TravelMateDB.getBudget(tripId);

  currentTripData = {
    id: trip.id,
    title: `${trip.destination} Scrapbook Days ✨`,
    subtitle: `${trip.dates ? (trip.dates.days || 'Upcoming') + ' Days' : ''} • ${trip.travellers ? (trip.travellers.count || 2) + ' People' : '2 People'} • ${trip.preferences ? trip.preferences.style || '' : ''}`,
    city: trip.destination,
    hotel: (trip.preferences && trip.preferences.accommodation) || (itinDays[0] && itinDays[0].hotel) || "Cosy Base",
    pace: (trip.preferences && trip.preferences.pace) || "Relaxed",
    crew: trip.travellers ? `${trip.travellers.count || 2} Travellers (${trip.travellers.type || 'Group'})` : "2 Travellers",
    crewCount: trip.travellers ? (trip.travellers.count || 2) : 2,
    currency: (budget && budget.amounts && budget.amounts.currency) || "₹",
    budget: trip.budget,
    days: itinDays && itinDays.length ? itinDays.map(d => ({
      dayNum: d.day,
      title: (d.activities && d.activities.title) || `Day ${d.day}: ${d.city}`,
      vibe: (d.activities && d.activities.vibe) || "🌸 Adventure & Bliss",
      hotel: d.hotel || "",
      morning: (d.activities && d.activities.morning) || {},
      afternoon: (d.activities && d.activities.afternoon) || {},
      evening: (d.activities && d.activities.evening) || {}
    })) : currentTripData.days,
    depDate: trip.dates ? (trip.dates.depDate || '') : '',
    retDate: trip.dates ? (trip.dates.retDate || '') : ''
  };

  activeDayIndex = 0;
  renderItinerary();
  if (packing && packing.length) {
    renderPackingItems(packing);
  }
  updatePackingProgress();

  if (budget && budget.amounts) {
    syncBudgetToTrip(budget.amounts.total || trip.budget, budget.amounts.currency || "₹", trip.travellers ? trip.travellers.count : 2);
  }
  showSection("itinerary");
  showToast(`Loaded ${trip.destination} from database! ✨`);
}

// --- DESTINATIONS FILTER ---
function filterDestinations(region, buttonEl) {
  const buttons = document.querySelectorAll(".filter-pill");
  buttons.forEach(btn => btn.classList.remove("active"));
  buttonEl.classList.add("active");

  const cards = document.querySelectorAll(".dest-card");
  cards.forEach(card => {
    const cardRegion = card.getAttribute("data-region");
    if (region === "all" || cardRegion === region) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// --- TOAST NOTIFICATIONS ---
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  if (!toast || !msgEl) return;

  msgEl.innerText = message;
  toast.classList.remove("hidden");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add("hidden");
  }, 3500);
}

// Helper to escape HTML strings safely
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
