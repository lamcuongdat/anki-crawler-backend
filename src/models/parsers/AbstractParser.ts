
export abstract class AbstractParser {
    abstract parse(buffer: Buffer): Promise<string[]>;
}