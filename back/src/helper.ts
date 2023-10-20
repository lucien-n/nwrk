export const generateId = (): string => {
  return Math.random().toString(36).slice(2, 6);
};

export const now = () => new Date().getTime();
