import { auth } from "@/lib/auth";
import { HomePage } from "@/modules/home/ui/views/home-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


 export const Page = async() => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if(!session) {
      redirect("/sign-in");
    }

    return (
      <HomePage/>
    )
}

export default Page;