import { agentsRouter } from '@/modules/agents/servers/procedures';
import { meetingsRouter } from '@/modules/meetings/servers/procedures';
import { createTRPCRouter } from '../init';


export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;