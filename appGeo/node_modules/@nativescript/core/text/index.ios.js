export * from './text-common';
export var encoding;
(function (encoding) {
    encoding.ISO_8859_1 = 5; //NSISOLatin1StringEncoding
    encoding.US_ASCII = 1; //NSASCIIStringEncoding
    encoding.UTF_16 = 10; //NSUnicodeStringEncoding
    encoding.UTF_16BE = 0x90000100; //NSUTF16BigEndianStringEncoding
    encoding.UTF_16LE = 0x94000100; //NSUTF16LittleEndianStringEncoding
    encoding.UTF_8 = 4; //NSUTF8StringEncoding
})(encoding || (encoding = {}));
//# sourceMappingURL=index.ios.js.map