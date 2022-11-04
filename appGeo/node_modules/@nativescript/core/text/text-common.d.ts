export declare class TextDecoder {
    get encoding(): string;
    decode(input: BufferSource): string;
    toString(): string;
    [Symbol.toStringTag]: string;
}
export declare class TextEncoder {
    get encoding(): string;
    encode(input?: string): Uint8Array;
    toString(): string;
    [Symbol.toStringTag]: string;
}
