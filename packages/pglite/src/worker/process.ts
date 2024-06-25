import * as Comlink from "comlink";
import { PGlite } from "../index.js";
import type { PGliteOptions, QueryOptions } from "../interface.js";

let db: PGlite;

const worker = {
  async init(dataDir?: string, options?: PGliteOptions) {
    db = new PGlite(dataDir, options);
    await db.waitReady;
    return true;
  },
  async close() {
    await db.close();
  },
  async query(query: string, params?: any[], options?: QueryOptions) {
    return await db.query(query, params, options);
  },
  async exec(query: string, options?: QueryOptions) {
    return await db.exec(query, options);
  },
  async writeFile(path: string, data: string | ArrayBufferView) {
    return await db.writeFile(path, data);
  },
  async removeFile(path: string) {
    return await db.removeFile(path);
  },
  async transaction(callback: (tx: any) => Promise<any>) {
    return await db.transaction((tx) => {
      return callback(Comlink.proxy(tx));
    });
  },
  async execProtocol(message: Uint8Array) {
    return await db.execProtocol(message);
  },
};

Comlink.expose(worker);

export type Worker = typeof worker;
