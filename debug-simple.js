const axios = require('axios');

async function test() {
    console.log('--- Starting Debug Test ---');

    // Test 1: Native Fetch
    try {
        console.log('\n1. Testing with native fetch...');
        const response = await fetch('https://api.dexscreener.com/latest/dex/search?q=SOL');
        const data = await response.json();
        console.log('Fetch Status:', response.status);
        console.log('Fetch Pairs Found:', data.pairs ? data.pairs.length : 0);
    } catch (error) {
        console.error('Fetch Error:', error.message);
    }

    // Test 2: Axios
    try {
        console.log('\n2. Testing with Axios...');
        const response = await axios.get('https://api.dexscreener.com/latest/dex/search?q=SOL');
        console.log('Axios Status:', response.status);
        console.log('Axios Pairs Found:', response.data.pairs ? response.data.pairs.length : 0);
    } catch (error) {
        console.error('Axios Error:', error.message);
        if (error.response) {
            console.error('Axios Response Status:', error.response.status);
            console.error('Axios Response Data:', error.response.data);
        }
    }

    // Test 3: Axios with User-Agent
    try {
        console.log('\n3. Testing with Axios + User-Agent...');
        const response = await axios.get('https://api.dexscreener.com/latest/dex/search?q=SOL', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        console.log('Axios+UA Status:', response.status);
        console.log('Axios+UA Pairs Found:', response.data.pairs ? response.data.pairs.length : 0);
    } catch (error) {
        console.error('Axios+UA Error:', error.message);
    }
}

test();
