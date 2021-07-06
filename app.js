//initials
var http = require('http');
var express = require('express')
const wordsFrequency = require('words-frequency');
const app = express();
var path = require('path');
var WordPOS = require('wordpos');
const plagiarism = require('plagiarism');
// var posa = require/('node-pos');
var port = process.env.PORT || 301;
var ejs = require('ejs');
app.use('/public', express.static(path.join(__dirname + '/public')));
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: false
}));
const detectNewline = require('detect-newline');
const keyword_extractor = require("keyword-extractor");
var Sentiment = require('sentiment');
const {
    json
} = require('body-parser');
wordpos = new WordPOS();
app.set('view engine', 'ejs');
//variables
var noun = "";
var verb = [];
var adv = [];
var adj = [];
var text = "";
var p, n, c, t;
var ch, wc, pos, neg, comp;
var key = [];
var fq = [];

app.get("/", (req, res) => {
    res.render('index')
})


app.post("/", (req, res) => {
    var text = req.body.document;
    var choice = req.body.options;
    console.log("your choice is " + choice);
    if (choice == 1) {
        main(res, text)

    }
    if (choice == 2) {
        countmain(res, text)
    }
    if (choice == 3) {
        sentimentalmain(res, text)
    }
    if (choice == 4) {
        tokenmain(res, text);
    }
    if (choice == 6) {
        posmain(res, text);
    }
    if (choice == 5) {
        plamain(res, text);
    }




})

app.get("/index.html", (req, res) => {
    res.render('index')
})

function countmain(res, text) {
    ch = charcount(text); //character count
    console.log(ch);
    wc = wordcount(text); //word count
    console.log(wc);
    res.render('output2', {
        count: 2,
        wc: wc,
        ch: ch
    });

}

function sentimentalmain(res, text) {

    sentimentalAnalysis(text); //sentimental analysis
    pos = positivePercentage(); //+ve
    neg = negativePercentage(); //-ve
    comp = c;
    res.render('output3', {
        pos: pos,
        neg: neg,
        comp: comp
    });
}

function tokenmain(res, text) {

    key = keywordExtractor(text) //keywords
    console.log("keyword:" + key)
    fq = JSON.stringify((frequency(text))); //freqency
    fq = fq.split(",");

    res.render('output4', {
        key: key,
        fq: fq
    });

}

function posmain(res, text) {
    partsOfSpeech(text);
    partsOfSpeech(text);
    res.render('output6', {
        n: noun,
        adj: adj,
        adv: adv,
        v: verb
    });


}
async function plamain(res, text) {
    var result = await makeGetRequest(text); //call to promise
    console.log(result);
    pal = 100 - result;
    res.render('output5', {
        u: result,
        pal: pal
    });
}

function charcount(text) {
    return text.length;
}


function wordcount(text) {
    var wc = 1;
    for (var i = 0; i < text.length; i++) {
        if (text[i] == " " || text[i] == "/0" || text[i] == "." || text[i] == ",") {
            if (text[i + 1] == " " || text[i + 1] == "/0" || text[i + 1] == "." || text[i + 1] == ",") {

            } else {
                wc++;
            }
        }
    }
    return wc;
}

function linecount(text) {
    var lc = 1;
    lc = detectNewline(text);
}




function sentimentalAnalysis(text) {
    var sentiment = new Sentiment();
    var result = sentiment.analyze(text);
    console.dir(result);
    p = result.positive.length;
    n = result.negative.length;
    c = result.comparative;
    t = result.words.length;


}


function positivePercentage() {
    var pos = (p / t);
    return pos;
}


function negativePercentage() {
    var neg = (n / t);
    return neg;
}



function keywordExtractor(text) {
    const extraction_result =
        keyword_extractor.extract(text, {
            language: "english",
            remove_digits: true,
            return_changed_case: true,
            remove_duplicates: false

        });

    return extraction_result;
}

function frequency(text) {
    console.log(wordsFrequency(text).data)
    return wordsFrequency(text).data;
}


function partsOfSpeech(text) {
    wordpos.getPOS(text, (data) => {
        noun = data.nouns;
        verb = data.verbs;
        adj = data.adjectives;
        adv = data.adverbs;
        console.log(data);

    })
}


let api;
async function makeGetRequest(text) {
    // return 1;
    return new Promise(function (resolve, reject) {
        plagiarism(text, {
            "text.ru": {
                "userkey": "45bdbc1701f1dd06a13279a9401e5572"
            }
        }).then(
            (response) => {
                var result = response;
                result = JSON.stringify(result); //freqency
                result = result.split(",");
                result = result[3].split(",");
                result = result[0].split(":");
                result = result[1]
                console.log('Processing Request');
                resolve(result);
            },
            (err) => {
                resolve(err);
            });
    })
}


async function main(res, text) {


    // console.log(noun)
    partsOfSpeech(text);
    partsOfSpeech(text);
    sentimentalAnalysis(text); //sentimental analysis
    pos = positivePercentage(); //+ve
    neg = negativePercentage(); //-ve
    comp = c; //comparison                      //partsofspeach
    var result = await makeGetRequest(text); //call to promise
    console.log(result);
    console.log('Statement 2');
    console.log(text);
    ch = charcount(text); //character count
    console.log(ch);
    wc = wordcount(text); //word count
    console.log(wc);

    key = keywordExtractor(text) //keywords
    console.log("keyword:" + key)
    fq = JSON.stringify((frequency(text))); //freqency
    fq = fq.split(",");
    pal = 100 - result;
    res.render('output', {
        wc: wc,
        ch: ch,
        p: pos,
        neg: neg,
        c: comp,
        keys: key,
        fq: fq,
        n: noun,
        adj: adj,
        adv: adv,
        v: verb,
        u: result,
        pal: pal
    });
}
app.listen(port, function (err) {
    if (err) {
        console.log(err);

    } else {
        console.log("Listening to port 300")
    }
})