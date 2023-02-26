export function isUrlAnImage(url: string): boolean {
  const extensions = ['jpg', 'jpeg', 'png', 'gif'];
  const extension = url.split('.').pop();
  return extensions.includes(extension);
}
