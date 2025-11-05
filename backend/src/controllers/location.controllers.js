


import axios from "axios";

export const FetchLocation = async (req, res) => {
  const { lat, lon } = req.body;
  // console.log("req.body", req.body);

  if (!lat || !lon) 
    return res.status(400).json({ error: "Latitude & longitude required" });

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    // console.log("response",response);
    
    const results = response.data.results;

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "No address found for these coordinates" });
    }

    let city = null;
    let district = null;
    let state = null;
    let country = null;

    // Loop through address components of the first result
    results[0].address_components.forEach((comp) => {
      if (comp.types.includes("locality") && !city) city = comp.long_name;
      if (comp.types.includes("administrative_area_level_2") && !district) district = comp.long_name;
      if (comp.types.includes("administrative_area_level_1") && !state) state = comp.long_name;
      if (comp.types.includes("country") && !country) country = comp.long_name;
    });

    // Fallback: if city is null, use district, then state
    const finalCity = city || district || state || "Unknown";

    res.json({
      city: finalCity,
      cityDetails: { city, district, state, country },
    });
  } catch (err) {
    console.error("Geocoding error:", err.message);
    res.status(500).json({ error: "Failed to fetch city" });
  }
};
