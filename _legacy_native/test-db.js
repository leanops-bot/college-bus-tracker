const firebase = require("firebase/compat/app").default;
require("firebase/compat/database");

const firebaseConfig = {
    apiKey: "AIzaSyDnpBcgYBGmY3z5Dg5y-XWBx7KrkDw9j7Y",
    authDomain: "college-bus-tracker-v1-abhi.firebaseapp.com",
    projectId: "college-bus-tracker-v1-abhi",
    storageBucket: "college-bus-tracker-v1-abhi.firebasestorage.app",
    messagingSenderId: "167078479716",
    appId: "1:167078479716:web:1adb8bd7db9ab1974a1c71",
    databaseURL: "https://college-bus-tracker-v1-abhi-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

console.log("Initializing Firebase with correct URL...");
try {
    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    const ref = db.ref("connection_check");

    console.log("Writing to database...");
    ref.set({
        status: "online",
        verified_at: new Date().toISOString()
    }).then(() => {
        console.log("SUCCESS: Connected and wrote to Realtime Database.");
        process.exit(0);
    }).catch((error) => {
        console.error("FAILURE: Database write failed:", error);
        process.exit(1);
    });
} catch (error) {
    console.error("FAILURE: Initialization error:", error);
    process.exit(1);
}
