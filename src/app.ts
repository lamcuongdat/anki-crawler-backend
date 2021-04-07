import express = require("express");
import {Anki} from "./models/Anki";
import {CrawlerService} from "./services/crawler.service";
import {OxfordCrawler} from "./models/crawlers/OxfordCrawler";
import cors = require('cors')
import bodyParser = require('body-parser')
import multer = require("multer");
import {AbstractParser} from "./models/parsers/AbstractParser";
import {CsvParser} from "./models/parsers/CsvParser";
import {MimeType} from "./enums/MimeType";
import {TxtParser} from "./models/parsers/TxtParser";
import {SoundDto} from "./dtos/SoundDto";

const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const port: number = 3000;
const crawlerService = new CrawlerService();

app.get('/ping', (req, res) => {
    res.status(200).json({
        message: 'pong'
    });
})
// app.get('/', (req, res) => {
//     const words: string[]= ['horse', 'simultaneous', 'rocking horse', 'wear out something', 'upgrade'];
//     // const words: string[]= ['到', '坐'];
//     crawlerService.getAnkiObjects(words, new OxfordCrawler()).then((results: Anki[]) => {
//         res.send(results);
//     });
// });

app.post('/files', multer().array('files'),(req, res) => {
    const file: Express.Multer.File = req.files[0];
    let parser: AbstractParser;

    if (file.mimetype === MimeType.CSV) {
        parser = new CsvParser();
    } else if (file.mimetype === MimeType.TXT) {
        parser = new TxtParser();
    } else {
        res.json([]);
        return;
    }

    parser.parse(Buffer.from(file.buffer))
        .then((results: string[]) => {
            crawlerService.getAnkiObjects(results, new OxfordCrawler()).then((ankiObjects: Anki[]) => {
                res.json(ankiObjects);
            });
        });
})

app.get('/words', (req, res) => {
    let wordList: string[] | string= <string[] | string> req.query.words;
    if (typeof wordList === 'string') {
        wordList = [wordList];
    }
    crawlerService.getAnkiObjects(wordList, new OxfordCrawler()).then((ankiObjects: Anki[]) => {
        res.json(ankiObjects);
    });
})

app.listen(process.env.PORT || port, () => {
    return console.log(`server is listening on ${port}`);
});

app.get('/audio', (req, res) => {
    let wordList: string[] | string= <string[] | string> req.query.urls;
    if (typeof wordList === 'string') {
        wordList = [wordList];
    }
    crawlerService.getAudioBlobs(wordList).then((sounds: SoundDto[]) => {
        res.send(sounds);
    })
})