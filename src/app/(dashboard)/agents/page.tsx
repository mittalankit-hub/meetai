import React, { Suspense } from 'react'
import {AgentView,  AgentLoadingView, AgentErrorView } from '@/modules/agents/ui/views/agents-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

const Agents = () => {

    const queryClient = getQueryClient()
    // This is where you can prefetch data if needed
    queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentLoadingView/>}>
            <ErrorBoundary fallback={<AgentErrorView/>}>
                <AgentView />
            </ErrorBoundary>
        </Suspense>
    </HydrationBoundary>
    
  )
}

export default Agents