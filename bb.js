const plagiarism = require('plagiarism');
 
plagiarism('Saniya Anush Shaikh ', {
    "text.ru": {
        "userkey": "fb7fbe83bd7836bbcbc213996df0c6db"
    }
}).then(res => {
    console.log(res);
}).catch(err => {
    console.error("Error"+err);
});