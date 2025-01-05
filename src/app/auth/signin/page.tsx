import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/app/api/auth/[...nextauth]/route";
import SignInForm from "@/components/SignInForm";
import Link from "next/link";

async function page() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/");

  return (
    <div>
      <div className="p-2 container mx-auto">
        <Link href={"/"} title="home" className="underline">
          24x7 Rudra Creative Home Decor
        </Link>
      </div>
      <h1 className="text-center text-2xl py-16">Admin Login</h1>
      <SignInForm />
    </div>
  );
}

export default page;
