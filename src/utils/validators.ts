export function isRequired(value: string): boolean {
  return value.trim().length > 0
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isValidPhone(value: string): boolean {
  return /^[0-9]{10}$/.test(value.trim())
}

export function minLength(value: string, length: number): boolean {
  return value.trim().length >= length
}

export type FieldErrors = Record<string, string>
