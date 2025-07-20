import { auth } from '@/lib/auth'
import UpgradeView, { UpgradeErrorView, UpgradeLoadingView } from '@/modules/premium/ui/views/upgrade-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

const Upgrade = async () => {

  const session = await auth.api.getSession({
    headers: await headers()
  })
  if(!session){
    redirect("/sign-in")
  }
  const queryClient = getQueryClient()

  queryClient.prefetchQuery(trpc.premium.getCurrentSubscription.queryOptions())
  queryClient.prefetchQuery(trpc.premium.getProducts.queryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<UpgradeLoadingView/>}>
        <ErrorBoundary fallback={<UpgradeErrorView/>}>
          <UpgradeView/>
        </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
  )
}

export default Upgrade