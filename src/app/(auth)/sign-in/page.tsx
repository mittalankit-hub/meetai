import { auth } from "@/lib/auth";
import {SignInView} from "@/modules/auth/ui/views/sign-in-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const SignIn = async ()=>{
    

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    //console.log("inside sign-in page: Session ->", session)
    
    if(!!session){
        redirect ("/"); // or you can redirect to a specific page
    }

    return <SignInView />
    
} 

export default SignIn