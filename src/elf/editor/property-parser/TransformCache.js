const MAX_CACHE_COUNT = 1000;
const cachedTransformMap = new Map();

export class TransformCache {
  static has(key) {
    return cachedTransformMap.has(key);
  }

  static get(key) {
    return cachedTransformMap.get(key);
  }

  static set(key, parsedValue) {
    if (cachedTransformMap.size > MAX_CACHE_COUNT) {
      cachedTransformMap.clear();
    }

    cachedTransformMap.set(key, parsedValue);
  }
}
