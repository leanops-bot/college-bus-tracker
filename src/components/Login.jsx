import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';
import { app } from '../firebase';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT'); // 'STUDENT' or 'DRIVER'
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getDatabase(app);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                // Login Flow
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const uid = userCredential.user.uid;

                // Fetch role from DB to redirect correctly
                const roleRef = ref(db, `users/${uid}/role`);
                const snapshot = await get(roleRef);
                const userRole = snapshot.val() || 'STUDENT';

                if (userRole === 'DRIVER') {
                    navigate('/driver');
                } else {
                    navigate('/student');
                }
            } else {
                // Signup Flow
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const uid = userCredential.user.uid;

                // Save role to DB
                await set(ref(db, `users/${uid}`), {
                    email: email,
                    role: role
                });

                if (role === 'DRIVER') {
                    navigate('/driver');
                } else {
                    navigate('/student');
                }
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>

            {!isLogin && (
                <div style={styles.roleContainer}>
                    <p>I am a:</p>
                    <div style={styles.roleButtons}>
                        <button
                            type="button"
                            style={role === 'STUDENT' ? styles.activeBtn : styles.btn}
                            onClick={() => setRole('STUDENT')}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            style={role === 'DRIVER' ? styles.activeBtn : styles.btn}
                            onClick={() => setRole('DRIVER')}
                        >
                            Driver
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleAuth} style={styles.form}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />

                {error && <p style={styles.error}>{error}</p>}

                <button type="submit" style={styles.submitBtn}>
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>

            <p style={styles.toggleText}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span onClick={() => setIsLogin(!isLogin)} style={styles.link}>
                    {isLogin ? 'Sign Up' : 'Login'}
                </span>
            </p>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: '15px',
        marginTop: '20px',
    },
    input: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    submitBtn: {
        padding: '12px',
        backgroundColor: '#646cff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    roleContainer: {
        marginTop: '10px',
    },
    roleButtons: {
        display: 'flex',
        gap: '10px',
        marginBottom: '10px',
    },
    btn: {
        flex: 1,
        padding: '8px 16px',
        cursor: 'pointer',
    },
    activeBtn: {
        flex: 1,
        padding: '8px 16px',
        backgroundColor: '#646cff',
        color: 'white',
        cursor: 'pointer',
        border: 'none',
    },
    error: {
        color: 'red',
        fontSize: '14px',
    },
    toggleText: {
        marginTop: '20px',
    },
    link: {
        color: '#646cff',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};

export default Login;
