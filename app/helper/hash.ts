const userImages = [
  "https://partyanimals.com/static/img/avatars_12@2x.f05718d8.jpg",
  "https://partyanimals.com/static/img/avatars_11@2x.c841344e.jpg",
  "https://partyanimals.com/static/img/avatars_10@2x.fdc921f3.jpg",
  "https://partyanimals.com/static/img/avatars_09@2x.349eb9e1.jpg",
  "https://partyanimals.com/static/img/avatars_08@2x.f4b168ab.jpg",
  "https://partyanimals.com/static/img/avatars_07@2x.5d95c63b.jpg",
  "https://partyanimals.com/static/img/avatars_06@2x.e1140503.jpg",
  "https://partyanimals.com/static/img/avatars_05@2x.4e4403b7.jpg",
  "https://partyanimals.com/static/img/avatars_04@2x.a8f03c96.jpg",
  "https://partyanimals.com/static/img/avatars_03@2x.7ab39dde.jpg",
  "https://partyanimals.com/static/img/avatars_02@2x.c7280e5d.jpg",
  "https://partyanimals.com/static/img/avatars_01@2x.4857b43c.jpg",
];

export default function hashToAvatar(str: string) {
  let idx = 0;
  const mod = userImages.length;
  for (const c of str) {
    idx += c.charCodeAt(0);
    idx %= mod;
  }
  console.log(userImages[idx]);
  return userImages[idx];
}
