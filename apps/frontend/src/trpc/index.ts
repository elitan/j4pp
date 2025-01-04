import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@j4pp/backend'

export const trpc = createTRPCReact<AppRouter>({})
