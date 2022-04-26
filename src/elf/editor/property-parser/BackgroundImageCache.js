const MAX_CACHE_COUNT = 1000;
const cachedBackgroundImageMap = new Map();

export class BackgroundImageCache {
  static has(key) {
    return cachedBackgroundImageMap.has(key);
  }

  static get(key) {
    return cachedBackgroundImageMap.get(key);
  }

  static set(key, parsedValue) {
    if (cachedBackgroundImageMap.size > MAX_CACHE_COUNT) {
      cachedBackgroundImageMap.clear();
    }

    cachedBackgroundImageMap.set(key, parsedValue);
  }
}
