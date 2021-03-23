import express = require("express");
import {Anki} from "./models/Anki";
import {CrawlerService} from "./services/crawler.service";
import {OxfordCrawler} from "./models/OxfordCrawler";
import cors = require('cors')
import bodyParser = require('body-parser')
import multer = require("multer");
import {AbstractParser} from "./models/AbstractParser";
import {CsvParser} from "./models/CsvParser";
import {MimeType} from "./enums/MimeType";

const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const port: number = 3000;
const crawlerService = new CrawlerService();
app.get('/', (req, res) => {
    const words: string[]= ['horse', 'simultaneous', 'rocking horse', 'wear out something', 'upgrade'];
    // const words: string[]= ['到', '坐'];
    crawlerService.getAnkiObjects(words, new OxfordCrawler()).then((results: Anki[]) => {
        res.send(results);
    });
});

app.post('/files', multer().array('files'),(req, res) => {
    const file: Express.Multer.File = req.files[0];
    const parser: AbstractParser = new CsvParser();
    if (file.mimetype === MimeType.CSV) {
        parser.parse(Buffer.from(file.buffer))
            .then((results: string[]) => {
                crawlerService.getAnkiObjects(results, new OxfordCrawler()).then((ankiObjects: Anki[]) => {
                    res.json(ankiObjects);
                });
            });
    } else if (file.mimetype === MimeType.TXT) {
        const fileContent: string[] = file.buffer.toString()
            .split('\t').join(',')
            .split('\r').join(',')
            .split('\n').join(',')
            .split(',')
            .filter((content: string) => content)
            .map((content: string) => content.trim());
        crawlerService.getAnkiObjects(fileContent, new OxfordCrawler()).then((ankiObjects: Anki[]) => {
            res.json(ankiObjects);
        });
    } else {
        res.json([]);
    }
})

app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});
