export interface Retry {
  retry(callback: Function): Promise<void>;
}
