import { Writable } from 'stream';

declare namespace BunyanSeq {
  interface SeqConfig {
    serverUrl?: string;
    apiKey?: string;
    logOtherAs?: 'Verbose' | 'Debug' | 'Information' | 'Warning' | 'Error' | 'Fatal';
    maxBatchingTime?: number;
    eventSizeLimit?: number;
    batchSizeLimit?: number;
    name?: string;
    level: config.level;
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
