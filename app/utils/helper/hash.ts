const userImages = [
  "https://partyanimals.com/assets/nemo-1ec2022f.webp",
  "https://partyanimals.com/assets/underbite-da11c605.webp",
  "https://partyanimals.com/assets/tiagra-720c8a6b.webp",
  "https://partyanimals.com/assets/macchiato-c82b08d5.webp",
  "https://partyanimals.com/assets/otta-5100f243.webp",
  "https://partyanimals.com/assets/morse-512323ce.webp",
  "https://partyanimals.com/assets/harry-3dadf282.webp",
  "https://partyanimals.com/assets/coco-57891444.webp",
  "https://partyanimals.com/assets/carrot-30dd3a88.webp",
  "https://partyanimals.com/assets/bacon-3f5a3683.webp",
  "https://partyanimals.com/assets/barbie-5199a7dd.webp",
  "https://partyanimals.com/assets/valiente-8a7eae7a.webp",
];

export default function hashToAvatar(str: string) {
  let idx = 0;
  const mod = userImages.length;
  for (const c of str) {
    idx += c.charCodeAt(0);
    idx %= mod;
  }
  return userImages[idx];
}

export function randomHead() {
  const hat = ["🧢", "🎩", "⛑", "🌦", "🎓", "👒", "👑"];
  const idx = Math.floor(Math.random() * hat.length);
  return hat[idx];
}
