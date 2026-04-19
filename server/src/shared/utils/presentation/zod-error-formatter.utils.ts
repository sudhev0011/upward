import { ZodError, z } from 'zod';

export function formatZodErrors(error: ZodError): string {

  return z.prettifyError(error)
}