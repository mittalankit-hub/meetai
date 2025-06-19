"use client"
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";



export const HomePage = ()=>{
  const {data:session} = authClient.useSession()
  //console.log("inside home page: Session ->", session)

  if(!session) {
    return(
      <p>Loading...</p>
    )
  }

    return (
      <div className="flex flex-col p-4 gap-4">
        <p>Logged in as {session?.user?.name} </p>
        <Button onClick={ ()=> authClient.signOut(
          {
            fetchOptions:{
              onSuccess: () => {
                redirect("/sign-in");
              }
            }
          }
        )}>
          Sign out
        </Button>
      </div>
    )
}

export default HomePage