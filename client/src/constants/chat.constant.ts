export const EMOJI_PALETTE = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export const getInitials = (name: string) => {
  return name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";
};