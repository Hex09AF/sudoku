import type { LSKey } from "~/declares/interaces/local-storage";

export class LSService {
  private static _instance: LSService;

  public static getInstance(): LSService {
    if (!this._instance) {
      this._instance = new LSService();
    }

    return this._instance;
  }

  private isAvailable() {
    return typeof localStorage !== "undefined";
  }

  public setKey(key: LSKey, item: string) {
    if (this.isAvailable()) localStorage.setItem(key, item);
  }

  public getKey(key: LSKey) {
    if (this.isAvailable())
      return JSON.parse(localStorage.getItem(key) as string);
    return undefined;
  }

  public removeKey(key: LSKey) {
    if (this.isAvailable()) localStorage.removeItem(key);
  }

  public clearAllKey() {
    if (this.isAvailable()) localStorage.clear();
  }
}
