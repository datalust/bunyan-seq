import { Writable } from 'stream';

declare namespace BunyanSeq {
  interface SeqConfig {
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

  interface SeqStreamConfig {
    name?: string;
    level?: string;
    type: 'raw';
    stream: Writable;
    reemitErrorEvents?: boolean;
  }

  function createStream(config: BunyanSeq.SeqConfig): SeqStreamConfig;
}

export = BunyanSeq;
