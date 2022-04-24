const MAX_CACHE_COUNT = 1000;
const cachedTransformOriginMap = new Map();

export class TransformOriginCache {
  static has(key) {
    return cachedTransformOriginMap.has(key);
  }

  static get(key) {
    return cachedTransformOriginMap.get(key);
  }

  static set(key, parsedValue) {
    if (cachedTransformOriginMap.size > MAX_CACHE_COUNT) {
      cachedTransformOriginMap.clear();
    }

    cachedTransformOriginMap.set(key, parsedValue);
  }
}
