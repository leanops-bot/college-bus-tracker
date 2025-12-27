import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { database } from '../firebase';

const SetHome = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isSearchbarFocused, setSearchbarFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Fetch data from Firebase Realtime Database
    const fetchData = async () => {
      try {
        const snapshot = await database.ref('/').once('value');
        const data = snapshot.val();
        // Ensure data is array
        const busList = Array.isArray(data) ? data : Object.values(data || {});

        const allRoutes = busList.reduce((acc, bus) => {
          // Merge all routes into a single array
          const routes = bus['Bus Route'] || [];
          return [...acc, ...routes];
        }, []);
        // Remove duplicates and sort the routes alphabetically
        const uniqueSortedLocations = [...new Set(allRoutes)].sort();
        setLocations(uniqueSortedLocations);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchbarFocused(false);

    // Redirect to BusList screen with the selected location
    navigation.navigate('BusList', { selectedLocation: location });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearchbarFocused(true);
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your destination</Text>
      <Searchbar
        placeholder="Search location"
        onChangeText={handleSearch}
        value={searchQuery}
        onIconPress={handleClear}
        style={styles.searchBar}
      />
      {isSearchbarFocused && (
        <View style={styles.dropdownContainer}>
          {locations
            .filter((location) =>
              location.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((location, index) => (
              <Text
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleLocationSelect(location)}
              >
                {location}
              </Text>
            ))}
        </View>
      )}
      {/* {selectedLocation ? (
        <Text style={styles.selectedLocation}>Selected location: {selectedLocation}</Text>
      ) : null} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 4,
    maxHeight: 150,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
  },
  selectedLocation: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default SetHome;
