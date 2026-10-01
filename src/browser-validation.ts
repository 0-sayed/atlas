import { z } from 'zod'

// Configure before importing application schemas: the browser disallows eval.
z.config({ jitless: true })
