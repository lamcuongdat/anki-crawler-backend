import {Anki} from "../Anki";
import {CoreOptions} from "request";

export enum ResponseType {
    RES, HTML
}
export abstract class AbstractCrawler {
    abstract getSearchUrl(keyword: string): string;

    abstract responseToAnki(response: any): Anki;

    getSearchOptions(keyword: string): CoreOptions {
        return {};
    };

    getResponseType(): ResponseType {
        return ResponseType.HTML;
    }
}