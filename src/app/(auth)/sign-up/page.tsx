import { auth } from "@/lib/auth";
import {SignUpView} from "@/modules/auth/ui/views/sign-up-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const SignIn = async ()=>{
    

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!!session){
        redirect ("/"); // or you can redirect to a specific page
    }

    return <SignUpView />
    
} 

export default SignIn