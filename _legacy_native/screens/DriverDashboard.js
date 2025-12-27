import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Button, List, ActivityIndicator } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
// Location import removed as we use LocationService
import { database, auth } from '../firebase';
import LocationService from '../services/LocationService';

const DriverDashboard = ({ navigation }) => {
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [isTracking, setIsTracking] = useState(false);

    useEffect(() => {
        // Fetch buses for dropdown
        const busesRef = database.ref('/'); // Assuming root is array of buses based on previous code
        busesRef.once('value').then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert data to array for picker if it's not already
                const busList = Array.isArray(data) ? data : Object.values(data);
                const pickerItems = busList.map((bus) => ({
                    label: `Bus ${bus.BusNo}`,
                    value: bus.BusNo,
                }));
                setBuses(pickerItems);
            }
        });

        return () => {
            stopTracking(); // Cleanup on unmount
        };
    }, []);

    const startTracking = async () => {
        if (!selectedBus) {
            Alert.alert('Error', 'Please select a bus first.');
            return;
        }

        try {
            await LocationService.startTracking((location) => {
                const { latitude, longitude, heading, speed, timestamp } = location;

                // Update Firebase
                database.ref(`buses/${selectedBus}/liveLocation`).set({
                    latitude,
                    longitude,
                    heading: heading || 0,
                    speed: speed || 0,
                    timestamp,
                    driverId: auth.currentUser.uid
                });
            });
            setIsTracking(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to start tracking.');
        }
    };

    const stopTracking = () => {
        LocationService.stopTracking();
        setIsTracking(false);
    };

    const handleLogout = async () => {
        stopTracking();
        await auth.signOut();
        // Navigation handled by AppWrapper auth state change
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Driver Dashboard</Text>

            <Text style={styles.label}>Select Your Bus:</Text>
            <RNPickerSelect
                onValueChange={(value) => setSelectedBus(value)}
                items={buses}
                style={pickerSelectStyles}
                placeholder={{ label: "Select a bus...", value: null }}
            />

            <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                    Status: {isTracking ? 'Tracking Live...' : 'Not Tracking'}
                </Text>
                {isTracking && <ActivityIndicator animating={true} color={'green'} />}
            </View>

            <Button
                mode="contained"
                onPress={isTracking ? stopTracking : startTracking}
                style={[styles.button, isTracking ? styles.stopButton : styles.startButton]}
                contentStyle={{ height: 50 }}
            >
                {isTracking ? 'Stop Tracking' : 'Start Tracking'}
            </Button>

            <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
                Logout
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    statusText: {
        fontSize: 18,
        marginRight: 10,
    },
    button: {
        marginVertical: 10,
    },
    startButton: {
        backgroundColor: '#4CAF50',
    },
    stopButton: {
        backgroundColor: '#F44336',
    },
    logoutButton: {
        marginTop: 20,
        borderColor: 'red',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        marginBottom: 20,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        marginBottom: 20,
    },
});

export default DriverDashboard;
