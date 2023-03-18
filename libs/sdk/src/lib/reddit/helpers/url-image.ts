const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];

export function isUrlImage(url: string): boolean {
  const extension = url.split('.').pop();
  return IMAGE_EXTENSIONS.includes(extension);
}
