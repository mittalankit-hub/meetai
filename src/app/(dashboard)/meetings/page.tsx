import React, { Suspense } from 'react'
import {MeetingsView, MeetingErrorView, MeetingLoadingView } from '@/modules/meetings/ui/views/meetings-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
//import { MeetingListHeader } from '@/modules/meetings/ui/components/meeting-list-header'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import type { SearchParams } from 'nuqs'
import { loadSearchParams } from '@/modules/agents/params'
import { MeetingListHeader } from '@/modules/meetings/ui/components/meeting-list-header'

interface Props {
  searchParams: Promise<SearchParams>
}

const Meetings = async({searchParams}:Props) => {

   const filters  = await loadSearchParams(searchParams)
   const session = await auth.api.getSession({
       headers: await headers(),
    });
    
  if(!session) {
      redirect("/sign-in");
    }
    const queryClient = getQueryClient()
    // This is where you can prefetch data if needed
    queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({
    ...filters
    }))
    queryClient.prefetchQuery(trpc.agents.getAgentListForDropdown.queryOptions())
  

  return (
    <>

    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>

              <MeetingListHeader />

        </Suspense>
    </HydrationBoundary>
    
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingLoadingView/>}>
            <ErrorBoundary fallback={<MeetingErrorView/>}>
                <MeetingsView />
            </ErrorBoundary>
        </Suspense>
    </HydrationBoundary>
    </>
  )
}

export default Meetings