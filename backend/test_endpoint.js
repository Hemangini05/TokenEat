const http = require('http');

const url = 'http://localhost:5000/api/waste/green-token?force=true';

http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', data);
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
