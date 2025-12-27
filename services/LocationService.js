import * as Location from 'expo-location';

let locationSubscription = null;

const LocationService = {
    /**
     * Request permissions and start tracking location.
     * @param {function} onUpdateCallback - Function called with location updates { latitude, longitude, heading, speed, timestamp }
     * @param {object} options - Optional expo-location options
     * @returns {Promise<void>}
     */
    startTracking: async (onUpdateCallback, options = {}) => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                throw new Error('Permission to access location was denied');
            }

            if (locationSubscription) {
                // Already tracking
                return;
            }

            locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 5000,
                    distanceInterval: 10,
                    ...options
                },
                (location) => {
                    const { latitude, longitude, heading, speed } = location.coords;
                    const timestamp = location.timestamp;

                    if (onUpdateCallback) {
                        onUpdateCallback({ latitude, longitude, heading, speed, timestamp });
                    }
                }
            );
        } catch (error) {
            console.error('Error starting location tracking:', error);
            throw error;
        }
    },

    /**
     * Stop tracking location.
     */
    stopTracking: () => {
        if (locationSubscription) {
            locationSubscription.remove();
            locationSubscription = null;
        }
    }
};

export default LocationService;
