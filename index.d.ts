import { LogLevel } from 'bunyan';

declare namespace BunyanSeq {

  interface SeqStreamConfig {
    serverUrl?: string;
    apiKey?: string;
    maxBatchingTime?: number;
    eventSizeLimit?: number;
    batchSizeLimit?: number;
    name?: string;
    level?: LogLevel;
    reemitErrorEvents?: boolean;
    onError?: (e: Error) => void;
  }

  interface SeqBunyanStream {
    name?: string;
    level?: LogLevel;
    type: 'raw';
    stream: NodeJS.WritableStream,
    reemitErrorEvents?: boolean
  }

  function createStream(config: SeqStreamConfig): SeqBunyanStream;

}

export = BunyanSeq;
