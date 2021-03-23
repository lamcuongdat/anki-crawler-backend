import {Anki} from "./Anki";

export enum ResponseType {
    RES, HTML
}
export abstract class AbstractCrawler {
    abstract getSearchUrl(keyword: string): string;

    abstract responseToAnki(response: any): Anki;

    getResponseType(): ResponseType {
        return ResponseType.HTML;
    }
}