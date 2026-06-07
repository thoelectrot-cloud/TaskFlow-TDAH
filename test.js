const testAuth = async () => {
    const registerRes = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'taha@test.com', password: 'password123' })
    });
    const registerData = await registerRes.json();
    console.log('Register Result:', registerData);

    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'taha@test.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    console.log('Login Result:', loginData);
};

testAuth();