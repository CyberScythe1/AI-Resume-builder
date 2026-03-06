async function test() {
    try {
        const res = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: 'Test resume summary' })
        });

        console.log('Status:', res.status);
        console.log('Headers:', res.headers.raw());

        const text = await res.text();
        console.log('Response body:', text);
    } catch (e) {
        console.error(e);
    }
}
test();
