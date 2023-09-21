const getRandomImage = (
  height: number,
  width: number,
  tags?: string[]
): string => {
  const baseUrl = `https://source.unsplash.com/random/${width}x${height}`;
  if (tags) {
    return `${baseUrl}?${tags.join(',')}`;
  }
  return baseUrl;
};

export default getRandomImage;
