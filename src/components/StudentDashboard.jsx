import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import LiveMap from './LiveMap';

const StudentDashboard = () => {
    const [selectedBus, setSelectedBus] = useState('');
    const auth = getAuth(app);
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut();
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Student Dashboard</h1>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>

            <div style={styles.searchCard}>
                <h2>Find Your Bus</h2>
                <div style={styles.inputGroup}>
                    <label>Select Bus Route:</label>
                    <select
                        value={selectedBus}
                        onChange={(e) => setSelectedBus(e.target.value)}
                        style={styles.select}
                    >
                        <option value="">-- Choose a Bus --</option>
                        <option value="Bus 1">Bus 1 (Avadi Route)</option>
                        <option value="Bus 2">Bus 2 (Tambaram Route)</option>
                        <option value="Bus 3">Bus 3 (Central Route)</option>
                    </select>
                </div>
            </div>

            {selectedBus && (
                <div style={styles.mapCard}>
                    <h3>Tracking: {selectedBus}</h3>
                    <LiveMap busId={selectedBus} />
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
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
    searchCard: {
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        color: '#333',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    select: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
    },
    mapCard: {
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '8px',
        color: '#333',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    }
};

export default StudentDashboard;
