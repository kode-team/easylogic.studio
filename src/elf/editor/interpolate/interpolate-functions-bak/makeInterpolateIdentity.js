export function makeInterpolateIdentity(layer, property, value) {
  return () => {
    return value;
  };
}
