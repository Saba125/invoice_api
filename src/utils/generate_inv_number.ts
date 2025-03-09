export default function generateInvNumber(
  length: number,
  prefix: string = "",
  suffix: string = "",
  upper?: boolean,
  lower?: boolean
): string {
  let result = ""
  let fullChars = ""
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lowerChars = "abcdefghijklmnopqrstuvwxyz"
  const numbers = "0123456789"
  const renderSuffix = suffix === null ? "" : suffix
  if (upper) fullChars += upperChars
  if (lower) fullChars += lowerChars
  if (!upper && !lower) fullChars += numbers

  if (fullChars.length === 0) {
    throw new Error("No character set selected.")
  }

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * fullChars.length)
    result += fullChars[randomIndex]
  }
  return `${prefix}${result}${renderSuffix}`
}
