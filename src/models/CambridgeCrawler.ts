import {AbstractCrawler} from "./AbstractCrawler";
import {Anki} from "./Anki";
import cheerioModule = require("cheerio");

export class CambridgeCrawler extends AbstractCrawler {
    getSearchUrl(keyword: string): string {
        const searchParam = keyword.split(' ').join('-');
        return `https://dictionary.cambridge.org/vi/dictionary/english/${searchParam}`;
    }

    responseToAnki(html: any): Anki {
        if (!html) {
            return new Anki();
        }
        const $ = cheerioModule.load(html);
        const name: string = $('.headword:first-child').first().text();
        return {
            name,
            vocab: name.toUpperCase(),
            wordForm: $('.posgram .pos.dpos').first().text(),
            level: $('.epp-xref.dxref').text().toUpperCase(),
            pronounce: $('.us .ipa.dipa').first().text(),
            example: $('.examp .eg').first().text(),
            definition: $('.ddef_h .def').first().text(),
        }
    }

}