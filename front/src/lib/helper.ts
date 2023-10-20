export const generateId = (): string => {
  return Math.random().toString(36).slice(2, 6);
};

export const now = () => new Date().getTime();

export const distanceVec = (a: number[], b: number[]): number => {
  var dx = a[0] - b[0];
  var dy = a[1] - b[1];
  var dz = a[2] - b[2];

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};
