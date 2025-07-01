import { z } from 'zod'

/**
 * Zod is a TypeScript-first validation library.
 * Define a schema and parse some data with it. You'll get back a strongly typed, validated result.
 * 
 * @link https://www.npmjs.com/package/zod
 */
export const sendCodeSchema = z.object({
    phone: z.string().min(10, 'Phone is required').max(15),
});

export const verifyCodeSchema = z.object({
    phone: z.string().min(10),
    code: z.string().regex(/^\d{6}$/, 'Code must be a 6-digit number'),
});
