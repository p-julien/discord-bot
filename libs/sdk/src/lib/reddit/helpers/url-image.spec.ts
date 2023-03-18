import { isUrlImage } from './url-image';

describe('isUrlAnImage', () => {
  it('should return true for a valid image url', () => {
    const url =
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    expect(isUrlImage(url)).toBe(true);
  });

  it('should return false for a valid image url', () => {
    const url = 'https://www.google.com';
    expect(isUrlImage(url)).toBe(false);
  });
});
