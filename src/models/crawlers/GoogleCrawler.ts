import {AbstractCrawler} from "./AbstractCrawler";
import {Anki} from "../Anki";
import cheerioModule = require("cheerio");

export class GoogleCrawler extends AbstractCrawler {
    getSearchUrl(keyword: string): string {
        const searchParam = keyword.split(' ').join('%20');
        return encodeURI(`https://www.google.com/search?q=${searchParam}&tbm=isch&tbs=itp:clipart&hl=vi&sa=X&ved=0CAEQpwVqFwoTCNCov_Kpj-4CFQAAAAAdAAAAABAC&biw=1519&bih=754`);
    }

    responseToAnki(html: any): Anki {
        const $ = cheerioModule.load(html);
        return {
            picture: $('table').find('img').attr('src')
        };
    }

}