
const plagiarism = require('plagiarism');
function makeGetRequest() { 

    return new Promise(function (resolve, reject) {
plagiarism(' Nature is an essay written by Ralph Waldo Emerson, published by James Munroe and Company in 1836. .Saniya SHaikh.. In the essay Emerson put forth the foundation of', {
    "text.ru": {

        "userkey": "e7dea45707c098768eff1fe9e279faaa"
    }
}).then(
    (response) => {
        var result = response;
        console.log('Processing Request');
        resolve(result);
    },
        (error) => {
        reject(error);
    });
    })}
    // function makeGetRequest(path) {
    //     return new Promise(function (resolve, reject) {
    //         axios.get(path).then(
    //             (response) => {
    //                 var result = response.data;
    //                 console.log('Processing Request');
    //                 resolve(result);
    //             },
    //                 (error) => {
    //                 reject(error);
    //             }
    //         );
    //     });
    // }
      
    async function main() {
        var result = await makeGetRequest();
        console.log(result);
        console.log('Statement 2');
    }
    main();