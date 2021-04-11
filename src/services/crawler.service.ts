import {Anki} from "../models/Anki";
import {AbstractCrawler, ResponseType} from "../models/crawlers/AbstractCrawler";
import {GoogleCrawler} from "../models/crawlers/GoogleCrawler";
import request = require("request");
import {FreeTTSSoundCrawler} from "../models/crawlers/FreeTTSSoundCrawler";
import {SoundDto} from "../dtos/SoundDto";
const fetch = require('node-fetch');
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
                    if (!anki.sound) {
                        const soundCrawler = new FreeTTSSoundCrawler();
                        request(soundCrawler.getSearchUrl(word), soundCrawler.getSearchOptions(word), (soundErr, soundRes, soundHtml) => {
                            try {
                                anki.sound = soundCrawler.getSoundURLFromId(JSON.parse(soundRes.body).id)
                            } catch (e) {
                                console.log(e);
                            } finally {
                                resolve(anki);
                            }
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

    public getAudioBlob(src: string): Promise<SoundDto> {
        return new Promise<SoundDto>(((resolve, reject) => {
            fetch(src)
                .catch(err => {
                    reject(err);
                })
                .then((response) => response.buffer())
                .then((buffer) => {
                    const dto: SoundDto = {
                        url: src,
                        blob: buffer.toString('base64')
                    }
                    resolve(dto);
                })
        }))
    }

    public getAudioBlobs(urls: string[]): Promise<SoundDto[]> {
        return new Promise<SoundDto[]>(resolve => {
            let promises: Promise<SoundDto>[] = [];
            urls.forEach((url: string) => {
                promises.push(this.getAudioBlob(url));
            })
            Promise.all(promises).then((results: SoundDto[]) => {
                resolve(results);
            })
        })
    }
}