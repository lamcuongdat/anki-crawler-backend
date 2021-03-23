import {Anki} from "../models/Anki";
import {AbstractCrawler, ResponseType} from "../models/AbstractCrawler";
import {GoogleCrawler} from "../models/GoogleCrawler";
import request = require("request");

export class CrawlerService {
    private getAnkiObject(word: string, crawler: AbstractCrawler): Promise<Anki> {
        return new Promise<Anki>((resolve) => {
            request(crawler.getSearchUrl(word), (err, res, html) => {
                const response = crawler.getResponseType() === ResponseType.HTML ? html : res
                const googleCrawler: GoogleCrawler = new GoogleCrawler();
                const anki: Anki = crawler.responseToAnki(response);
                request(googleCrawler.getSearchUrl(word), (err, res, googleHtml) => {
                    anki.picture = googleCrawler.responseToAnki(googleHtml).picture;
                    resolve(anki);
                })
            })
        })
    }

    public getAnkiObjects(words: string[], crawler: AbstractCrawler): Promise<Anki[]> {
        return new Promise((resolve) => {
            let promises: Promise<Anki>[] = [];
            words.forEach((word: string) => {
                promises.push(this.getAnkiObject(word, crawler));
            })
            Promise.all(promises).then((results: Anki[]) => {
                resolve(results);
            })
        });
    }
}