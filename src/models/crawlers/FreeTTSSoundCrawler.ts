import {AbstractCrawler, ResponseType} from "./AbstractCrawler";
import {Anki} from "../Anki";
import {CoreOptions} from "request";
import {HttpMethod} from "../../enums/HttpMethod";
import {Links} from "../../constants/Links";
export class FreeTTSSoundCrawler extends AbstractCrawler{
    getSearchUrl(keyword: string): string {
        return Links.FREE_TTS_REQUEST_URL;
    }

    getSearchOptions(keyword: string): CoreOptions {
        return {
            baseUrl: Links.FREE_TTS_DOMAIN,
            method: HttpMethod.GET,
            qs: {
                'Language': 'en-US',
                'Voice': 'en-US-Standard-D',
                'TextMessage': keyword,
                'type': 0
            }
        };
    }

    responseToAnki(response: any): Anki {
        return undefined;
    }

    getResponseType(): ResponseType {
        return ResponseType.RES;
    }

    getSoundURLFromId(id: string): string {
        if (id.indexOf('.mp3') < 0) {
            return '';
        } else {
            return `${Links.FREE_TTS_DOMAIN}${Links.FREE_TTS_SOUND_PLAYING}/${id}`;
        }
    }
}