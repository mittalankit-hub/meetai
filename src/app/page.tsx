"use client"
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

 
 
 
 const Page = () => {
  const {data:sesssion} = authClient.useSession()
  if(!sesssion){
    return(
      <div>Loading....</div>
    )
  }
  return (
    <div className="flex flex-col p-4 gap-4">
      <p>Logged in as {sesssion.user?.name} </p>
      <Button onClick={()=>authClient.signOut()}>
        Sign out
      </Button>
    </div>
  )
}

export default Page;