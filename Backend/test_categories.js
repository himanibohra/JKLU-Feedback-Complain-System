const run = async () => {
    try {
        // 0. Check Root
        console.log("Checking root...");
        const rootRes = await fetch('http://localhost:8080/');
        console.log("Root status:", rootRes.status);
        console.log("Root text:", await rootRes.text());

        // 1. Login
        console.log("Logging in...");
        const loginRes = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123'
            })
        });

        if (!loginRes.ok) {
            const errText = await loginRes.text();
            throw new Error(`Login failed: ${loginRes.status} ${errText}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log("Token received.");

        // 2. Get Categories
        console.log("Fetching categories...");
        const catRes = await fetch('http://localhost:8080/api/complaints/categories', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Status:", catRes.status);
        const catData = await catRes.json();
        console.log("Data:", JSON.stringify(catData, null, 2));

    } catch (err) {
        console.error("Error:", err.message);
    }
};

run();
