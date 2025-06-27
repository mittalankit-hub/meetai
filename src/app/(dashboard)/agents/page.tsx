import React, { Suspense } from 'react'
import {AgentView,  AgentLoadingView, AgentErrorView } from '@/modules/agents/ui/views/agents-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { AgentListHeader } from '@/modules/agents/ui/components/agent-list-header'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const Agents = async() => {

   const session = await auth.api.getSession({
       headers: await headers(),
    });
    
  if(!session) {
      redirect("/sign-in");
    }
    const queryClient = getQueryClient()
    // This is where you can prefetch data if needed
    queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())

  return (
    <>
    <AgentListHeader />
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentLoadingView/>}>
            <ErrorBoundary fallback={<AgentErrorView/>}>
                <AgentView />
            </ErrorBoundary>
        </Suspense>
    </HydrationBoundary>
    </>
  )
}

export default Agents