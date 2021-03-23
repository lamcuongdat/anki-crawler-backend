import {AbstractParser} from "./AbstractParser";
import csvParser = require("csv-parser");
import {Readable} from 'stream';

interface Word {
    word: string;
}
export class CsvParser extends AbstractParser {
    parse(buffer: Buffer): Promise<string[]> {
        return new Promise<string[]>(((resolve) => {
            const result: string[] = [];
            Readable.from(buffer)
                .pipe(csvParser(['word']))
                .on('data', (chunk: Word) => {
                    result.push(chunk.word)
                })
                .on('end', () => {
                    resolve(result);
                })
        }));
    }
}