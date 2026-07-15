const generateAdventurer = (seed) =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;

export const generateAvatar = () => {
  const data = [];

  for (let i = 0; i < 12; i++) {
    data.push(generateAdventurer(Math.random().toString(36).substring(2, 10)));
  }

  return data;
};