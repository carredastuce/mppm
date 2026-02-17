const PIN_SALT = 'mppm-parent-pin'

function djb2Hash(str: string): string {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i)
  }
  return Math.abs(hash).toString(36)
}

export function hashPin(pin: string): string {
  return djb2Hash(`${PIN_SALT}:${pin}`)
}

export function verifyPin(input: string, storedHash: string): boolean {
  return hashPin(input) === storedHash
}

export function validatePin(pin: string): boolean {
  return /^\d{4}$/.test(pin)
}
