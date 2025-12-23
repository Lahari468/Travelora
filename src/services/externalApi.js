import axios from 'axios';

const GEOAPIFY_API_KEY = 'bf40fa58f8af4c5fa2c93d73a34f48f1';
const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v1/geocode/search';
const GEOAPIFY_PLACES_URL = 'https://api.geoapify.com/v2/places';

export const searchCity = async (query) => {
    try {
        const response = await axios.get(GEOAPIFY_BASE_URL, {
            params: {
                text: query,
                apiKey: GEOAPIFY_API_KEY,
                type: 'city',
                limit: 5
            }
        });

        if (!response.data.features || response.data.features.length === 0) {
            return [];
        }

        // Transform Geoapify results to match our app's structure
        return response.data.features.map(feature => ({
            place_id: feature.properties.place_id,
            name: feature.properties.city || feature.properties.name,
            display_name: feature.properties.formatted,
            lat: feature.properties.lat,
            lon: feature.properties.lon,
            country: feature.properties.country,
            city: feature.properties.city,
            description: `Explore the beautiful city of ${feature.properties.city || feature.properties.name}, ${feature.properties.country}.`,
            images: ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop"] // Placeholder image
        }));
    } catch (error) {
        console.error('Error searching city with Geoapify:', error);
        return [];
    }
};

export const getNearbyPlaces = async (lat, lon, categories = 'tourism.sights') => {
    try {
        const response = await axios.get(GEOAPIFY_PLACES_URL, {
            params: {
                categories: categories,
                filter: `circle:${lon},${lat},5000`, // 5km radius
                limit: 10,
                apiKey: GEOAPIFY_API_KEY
            }
        });

        return response.data.features.map(feature => ({
            place_id: feature.properties.place_id,
            name: feature.properties.name,
            address: feature.properties.formatted,
            lat: feature.properties.lat,
            lon: feature.properties.lon,
            categories: feature.properties.categories,
            image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1000&auto=format&fit=crop" // Placeholder
        }));
    } catch (error) {
        console.error('Error fetching nearby places:', error);
        return [];
    }
};

export const getCityDetails = async (cityName) => {
    // For now, we'll return a basic structure since Geoapify doesn't provide rich text descriptions like Wikipedia.
    // In a real app, we might query Wikipedia here or use another API.
    // For consistency with the previous implementation, we'll return a placeholder description.
    return {
        description: `Explore the beautiful city of ${cityName}. Discover its rich history, vibrant culture, and stunning architecture. Whether you're looking for adventure or relaxation, ${cityName} has something for everyone.`,
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop"
    };
};
