import { agentsRouter } from '@/modules/agents/servers/procedures';
import { meetingsRouter } from '@/modules/meetings/servers/procedures';
import { createTRPCRouter } from '../init';
import { premiumRouter } from '@/modules/premium/servers/procedures';


export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
  premium: premiumRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;