import { LogLevel, Stream } from 'bunyan';

declare namespace BunyanSeq {

  interface SeqStreamOptions {
    serverUrl?: string;
    apiKey?: string;
    maxBatchingTime?: number;
    eventSizeLimit?: number;
    batchSizeLimit?: number;
    name?: string;
    level?: LogLevel;
    reemitErrorEvents?: boolean;
    onError?(e: Error): void;
  }

  function createStream(options?: SeqStreamOptions): Stream;

}

export = BunyanSeq;
