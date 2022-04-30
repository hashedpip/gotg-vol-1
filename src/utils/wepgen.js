// 256-bit WEP: 64-digit-key
function generateHexString (length) {
  // Use crypto.getRandomValues if available
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.getRandomValues === 'function'
  ) {
    const tmp = new Uint8Array(Math.max(~~length / 2))
    crypto.getRandomValues(tmp)
    return Array.from(tmp)
      .map((n) => ('0' + n.toString(16)).substr(-2))
      .join('')
      .substr(0, length)
  }

  // fallback to Math.getRandomValues
  let ret = ''
  while (ret.length < length) {
    ret += Math.random().toString(16).substring(2)
  }
  return ret.substring(0, length)
}

module.exports = { generateHexString }
