const MAX_CACHE_COUNT = 1000;
const cachedPatternMap = new Map();

export class PatternCache {
  static has(key) {
    return cachedPatternMap.has(key);
  }

  static get(key) {
    return cachedPatternMap.get(key);
  }

  static set(key, parsedValue) {
    if (cachedPatternMap.size > MAX_CACHE_COUNT) {
      cachedPatternMap.clear();
    }

    cachedPatternMap.set(key, parsedValue);
  }
}
