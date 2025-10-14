export class InputSanitizer {
  static sanitizeName(name: string): string {
    if (!name) return '';
    return name.trim().replace(/[<>]/g, '');
  }

  static sanitizeEmail(email: string): string {
    if (!email) return '';
    return email.trim().toLowerCase();
  }

  static sanitizeString(input: string): string {
    if (!input) return '';
    return input.trim().replace(/[<>]/g, '');
  }
}

export function sanitizeInput(input: string): string {
  return InputSanitizer.sanitizeString(input);
}
