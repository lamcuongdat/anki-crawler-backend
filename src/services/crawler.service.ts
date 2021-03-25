import {Anki} from "../models/Anki";
import {AbstractCrawler, ResponseType} from "../models/crawlers/AbstractCrawler";
import {GoogleCrawler} from "../models/crawlers/GoogleCrawler";
import request = require("request");
import {FreeTTSSoundCrawler} from "../models/crawlers/FreeTTSSoundCrawler";

export class CrawlerService {
    private getAnkiObject(word: string, crawler: AbstractCrawler): Promise<Anki> {
        return new Promise<Anki>((resolve) => {
            request(crawler.getSearchUrl(word), (err, res, html) => {
                const response = crawler.getResponseType() === ResponseType.HTML ? html : res
                const googleCrawler: GoogleCrawler = new GoogleCrawler();
                const anki: Anki = crawler.responseToAnki(response);

                //Get image from Google
                request(googleCrawler.getSearchUrl(word), (err, res, googleHtml) => {
                    anki.picture = googleCrawler.responseToAnki(googleHtml).picture;
                    if (!anki.name) {
                        anki.name = word;
                    }

                    //If there is no sound URL from dictionary
                    //Get it from FreeTTS
                    if(!anki.sound) {
                        const soundCrawler = new FreeTTSSoundCrawler();
                        request(soundCrawler.getSearchUrl(word), soundCrawler.getSearchOptions(word), (soundErr, soundRes, soundHtml) => {
                            anki.sound = soundCrawler.getSoundURLFromId(JSON.parse(soundRes.body).id);
                            resolve(anki);
                        })
                    } else {
                        resolve(anki);
                    }
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