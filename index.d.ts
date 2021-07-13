import { Writable } from 'stream';

declare namespace BunyanSeq {

  interface SeqStreamConfig {
    serverUrl?: string;
    apiKey?: string;
    maxBatchingTime?: number;
    eventSizeLimit?: number;
    batchSizeLimit?: number;
    name?: string;
    level: string;
    reemitErrorEvents?: boolean;
    onError?: (e: Error) => void;
  }

  function createStream(config: SeqStreamConfig): Writable;

}

export = BunyanSeq;
