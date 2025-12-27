import React, { useState, useEffect } from 'react';
import { getDatabase, ref, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

const DriverDashboard = () => {
    const [busId, setBusId] = useState('Bus 1');
    const [isTracking, setIsTracking] = useState(false);
    const [location, setLocation] = useState(null);
    const [error, setError] = useState('');
    const [watchId, setWatchId] = useState(null);

    const db = getDatabase(app);
    const auth = getAuth(app);
    const navigate = useNavigate();

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [watchId]);

    const startTracking = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setIsTracking(true);
        setError('');

        const id = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, heading, speed } = position.coords;
                setLocation({ latitude, longitude });

                // Update Firebase
                const updates = {};
                updates[`/buses/${busId}/liveLocation`] = {
                    latitude,
                    longitude,
                    heading: heading || 0,
                    speed: speed || 0,
                    timestamp: Date.now()
                };
                updates[`/buses/${busId}/driverId`] = auth.currentUser ? auth.currentUser.uid : 'anonymous';

                update(ref(db), updates).catch(err => {
                    console.error("Firebase Update Error:", err);
                    setError("Failed to sync location");
                });
            },
            (err) => {
                setError(`Location Error: ${err.message}`);
                setIsTracking(false);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            }
        );

        setWatchId(id);
    };

    const stopTracking = () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
        setIsTracking(false);
    };

    const handleLogout = () => {
        stopTracking();
        auth.signOut();
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Driver Dashboard</h1>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>

            <div style={styles.card}>
                <h2>Select Your Bus</h2>
                <select
                    value={busId}
                    onChange={(e) => {
                        stopTracking(); // Stop if changing bus
                        setBusId(e.target.value);
                    }}
                    style={styles.select}
                >
                    <option value="Bus 1">Bus 1 (Avadi Route)</option>
                    <option value="Bus 2">Bus 2 (Tambaram Route)</option>
                    <option value="Bus 3">Bus 3 (Central Route)</option>
                </select>

                <div style={styles.statusBox}>
                    <p>Status:
                        <span style={isTracking ? styles.live : styles.offline}>
                            {isTracking ? ' ● BROADCASTING LIVE' : ' ○ OFF DUTY'}
                        </span>
                    </p>

                    {location && (
                        <p style={styles.coord}>
                            Lat: {location.latitude.toFixed(5)}, Lng: {location.longitude.toFixed(5)}
                        </p>
                    )}
                </div>

                {error && <p style={styles.error}>{error}</p>}

                {!isTracking ? (
                    <button onClick={startTracking} style={styles.startBtn}>
                        Start Tracking
                    </button>
                ) : (
                    <button onClick={stopTracking} style={styles.stopBtn}>
                        Stop Tracking
                    </button>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    logoutBtn: {
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        color: '#333',
    },
    select: {
        width: '100%',
        padding: '10px',
        marginBottom: '20px',
        borderRadius: '4px',
        borderColor: '#ddd',
        fontSize: '16px',
    },
    statusBox: {
        margin: '20px 0',
        padding: '10px',
        backgroundColor: '#fff',
        borderRadius: '4px',
        border: '1px solid #eee',
    },
    live: {
        color: 'green',
        fontWeight: 'bold',
        marginLeft: '5px',
    },
    offline: {
        color: 'gray',
        marginLeft: '5px',
    },
    coord: {
        fontSize: '12px',
        color: '#666',
        marginTop: '5px',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
    startBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    stopBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
    },
};

export default DriverDashboard;
