import {AbstractParser} from "./AbstractParser";

export class TxtParser extends AbstractParser{
    parse(buffer: Buffer): Promise<string[]> {
        const fileContent: string[] = buffer.toString()
            .split('\t').join(',')
            .split('\r').join(',')
            .split('\n').join(',')
            .split(',')
            .filter((content: string) => content)
            .map((content: string) => content.trim());

        return Promise.resolve(fileContent);
    }
}