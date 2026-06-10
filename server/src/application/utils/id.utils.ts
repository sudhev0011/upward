export const toStringId = (id: unknown): string => {
  if (id == null) {
    throw new Error("Invalid id");
  }

  return String(id);
};