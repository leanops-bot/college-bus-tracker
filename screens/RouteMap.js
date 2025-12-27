import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Linking, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { FAB, List, Divider } from 'react-native-paper';
import axios from 'axios';
import { database } from '../firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const RouteMap = ({ route }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busLocation, setBusLocation] = useState(null);
  const { busNumber } = route.params;

  useEffect(() => {
    // Function to fetch coordinates for each route from the given address
    const fetchRouteCoordinates = async (routes) => {
      try {
        const allRoutes = [];
        for (const address of routes) {
          const response = await axios.get(`https://geocode.maps.co/search?q=${address},Chennai,Tamilnadu,India`);
          const data = response.data;
          const lat = parseFloat(data[0]?.lat);
          const lon = parseFloat(data[0]?.lon);

          // Check if the location is within Chennai (approximately)
          // You can adjust the latitude and longitude bounds based on your specific area requirements
          if (lat >= 12.70 && lat <= 13.10 && lon >= 80.15 && lon <= 80.30) {
            allRoutes.push({ latitude: lat, longitude: lon, address }); // Include the address in the route object
          } else {
            console.log('Invalid latitude or longitude for location:', address);
          }
        }

        setRoutes(allRoutes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching route coordinates:', error);
        setLoading(false);
      }
    };

    // Call the fetch function with a delay of 3 seconds
    const delay = 3000; // 3 seconds
    const timer = setTimeout(() => fetchRouteCoordinates(route.params.routes), delay); // Access the routes array from route.params

    // Live Location Subscription
    if (busNumber) {
      const locationRef = database.ref(`buses/${busNumber}/liveLocation`);
      locationRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setBusLocation({
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: data.timestamp
          });
        }
      });

      // Cleanup subscription
      return () => {
        clearTimeout(timer);
        locationRef.off();
      }
    }

    // Clear the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [route.params.routes, busNumber]);

  const openInGoogleMaps = () => {
    const routeUrl = routes
      .map((coordinate) => `${coordinate.latitude},${coordinate.longitude}`)
      .join('/');
    Linking.openURL(`https://www.google.com/maps/dir/${routeUrl}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top half with MapView */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: routes.length > 0 ? routes[0].latitude : 0,
            longitude: routes.length > 0 ? routes[0].longitude : 0,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {routes.map((coordinate, index) => (
            <Marker key={index} coordinate={coordinate} title={`Stop ${index + 1}`} />
          ))}
          {routes.length > 1 && (
            <Polyline coordinates={routes} strokeColor="#000" strokeWidth={2} />
          )}
          {busLocation && (
            <Marker coordinate={busLocation} title={`Bus ${busNumber}`}>
              <View style={styles.busMarker}>
                <MaterialCommunityIcons name="bus" size={30} color="blue" />
              </View>
              <MapView.Callout>
                <View>
                  <Text style={{ fontWeight: 'bold' }}>Bus {busNumber}</Text>
                  <Text>Live Location</Text>
                  {busLocation.timestamp && (
                    <Text style={{ fontSize: 10, color: 'gray' }}>
                      Updated: {new Date(busLocation.timestamp).toLocaleTimeString()}
                    </Text>
                  )}
                </View>
              </MapView.Callout>
            </Marker>
          )}
        </MapView>
      </View>

      {/* Bottom half with routes list */}
      <View style={styles.routesContainer}>
        <ScrollView>
          <List.Section>
            <List.Subheader>Routes</List.Subheader>
            {routes.map((route, index) => ( // Change the variable name to route
              <View key={index}>
                <List.Item
                  title={`Stop ${index + 1}`}
                  description={route.address} // Display the address here
                  left={(props) => <List.Icon {...props} icon="map-marker" />}
                />
                <Divider />
              </View>
            ))}
          </List.Section>
        </ScrollView>
      </View>

      {/* Floating button */}
      <FAB
        style={styles.fab}
        icon="map"
        onPress={openInGoogleMaps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  busMarker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'blue',
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  routesContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: 'gray',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    overflow: 'hidden',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default RouteMap;
