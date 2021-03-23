import {AbstractCrawler} from "./AbstractCrawler";
import {Anki} from "./Anki";
import cheerioModule = require("cheerio");

export class OxfordCrawler extends AbstractCrawler {
    getSearchUrl(keyword: string): string {
        const searchParam = keyword.split(' ').join('-');
        return `https://www.oxfordlearnersdictionaries.com/definition/english/${searchParam}`;
    }

    responseToAnki(html: any): Anki {
        if (!html) {
            return new Anki();
        }
        const $ = cheerioModule.load(html);
        const name: string = $('.top-container .headword').first().text();
        return {
            name,
            vocab: name.toUpperCase(),
            wordForm: $('.top-container .pos').first().text(),
            level: $('.oald .topic-g .topic_cefr').first().text().toUpperCase(),
            pronounce: $('.top-container .phons_n_am .phon').first().text(),
            example: $('.oald ul.examples li').first().text(),
            definition: $('.oald .def').first().text(),
            sound: $('.phonetics .phons_n_am .sound').first().attr('data-src-mp3')
        }
    }

}