import axios from 'axios'

export const getCoordinates = async (address) => {
  console.log("getCoordinates address", address);
  try {
    // Try the full address first
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    let res = await axios.get(url);
    let data = res.data;

    // If not found, try simplifying the address
    if (!data || data.length === 0) {
      console.log("Retrying with simplified address...");
      const parts = address.split(",");
      const simplified = parts.slice(-2).join(","); // Take last two parts like "Vaikom, Kerala"
      const retryUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(simplified)}&format=json&limit=1`;
      res = await axios.get(retryUrl);
      data = res.data;
    }

    if (!data || data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error("Geocoding error:", error.message);
    return null;
  }
};
