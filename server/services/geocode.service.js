import axios from "axios";

export async function getCoordinates(address) {
  try {
    const response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          key: process.env.GEOCODE_API_KEY,
          q: address
        }
      }
    );

    const data = response.data.results[0];

    if (!data) {
      throw new Error("Invalid address");
    }

    return {
      latitude: data.geometry.lat,
      longitude: data.geometry.lng
    };

  } catch (err) {
    console.log("Geocode Error:", err.message);
    throw err;
  }
}