export function omissionText(text: string, i: number): string {
  return text.length > i ? `${text.slice(0, i)} ...` : text
}
