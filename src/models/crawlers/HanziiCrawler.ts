import {AbstractCrawler, ResponseType} from "./AbstractCrawler";
import {Anki} from "../Anki";

export class HanziiCrawler extends AbstractCrawler{
    getSearchUrl(keyword: string): string {
        return encodeURI(`https://hanzii.net/api/search/vi/${keyword}?type=word&page=1&limit=1`.split(' ').join(''));
    }

    responseToAnki(response:any): Anki {
        const responseJson = JSON.parse(response.body);
        return {
            name: responseJson.result[0].word,
            vocab: responseJson.result[0].word,
            level: `HSK${responseJson.result[0].lv_hsk}`,
            pronounce: responseJson.result[0].pinyin,
            definition: responseJson.result[0].content[0].means[0].mean,
            example: this.getExamples(responseJson.result[0].content[0].means[0].examples)
        };
    }


    getResponseType(): ResponseType {
        return ResponseType.RES;
    }

    private getExamples(examples: HanziiExample[]): string {
        let exampleString = '';
        examples.forEach((example: HanziiExample) => {
            exampleString += `${example.e} - ${example.m}\n`
        })
        return exampleString;
    }
}

interface HanziiExample {
    _id: string;
    _rev: string;
    id: number
    type: string
    e: string
    m: string
    p_cn: string
    p_vn: string
    p: string;
}