/**
 * Generate random name, with selected length characters. Default length is 12.
 * @param length Length of random string.
 * @returns Randomized name.
 */
// eslint-disable-next-line import/prefer-default-export
export const generateRandomName = (length: number = 12): string => {
  const vocabulary = 'ABCDEFGHIJKLMNOUPRSTUWZabcdefghijklmnouprstuwz';
  let name = '';
  for (let x = 0; x < length; x++) {
    name += vocabulary[Math.floor(Math.random() * vocabulary.length)];
  }
  return name;
};
