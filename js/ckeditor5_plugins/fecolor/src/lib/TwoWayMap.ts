// A utility class for a two-way map, allowing lookups in both directions.
export default class TwoWayMap<K, V> {
  private forwardMap = new Map<K, V>();
  private reverseMap = new Map<V, K>();

  set(key: K, value: V): void {
    this.forwardMap.set(key, value);
    this.reverseMap.set(value, key);
  }

  getForward(key: K): V | undefined {
    return this.forwardMap.get(key);
  }

  getReverse(value: V): K | undefined {
    return this.reverseMap.get(value);
  }

  hasForward(key: K): boolean {
    return this.forwardMap.has(key);
  }

  hasReverse(value: V): boolean {
    return this.reverseMap.has(value);
  }

  delete(key: K): boolean {
    const value = this.forwardMap.get(key);
    if (value !== undefined) {
      this.forwardMap.delete(key);
      this.reverseMap.delete(value);
      return true;
    }
    return false;
  }
}
