declare module "lamejs" {
    export default class lamejs {
        static Mp3Encoder: {
            new (channels: number, sampleRate: number, kbps: number): {
                encodeBuffer(buffer: Int16Array): number[];
                encodeBuffer(left: Int16Array, right: Int16Array): number[];
                flush(): number[];
            };
        };
    }
}
