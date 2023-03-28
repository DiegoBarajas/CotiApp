const backend = ()=>{
    const url = document.URL.split('/')[2];
    return url === 'localhost:3000'
            ? 'http://localhost:4000'
            : 'https://cotiapp.onrender.com'
}

module.exports = backend;