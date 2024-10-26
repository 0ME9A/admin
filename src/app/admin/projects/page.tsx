import { ProjectFace } from "@/ts/components";
import { Suspense } from "react";
import CreateNewProjectContainer from "@/components/Porjects/CreateNewProjectContainer";
import GlobalDeleteDialog from "@/components/Porjects/GlobalDeleteDialog";
import GlobalEditDialog from "@/components/Porjects/GlobalEditDialog";
import ProjectCard from "@/components/cards/ProjectCard";
import FailedToFetch from "@/components/failed-to-fetch";
import Loading from "@/components/loading";

async function page() {
  let projects: ProjectFace[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch Projects.");

    const apiResponse = await res.json();
    projects = apiResponse.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return (
      <FailedToFetch
        message={
          <p className="text-[3rem] sm:text-[4rem] xl:text-[5rem] leading-none font-[200]">
            Failed to fetch <br />
            <em className="font-[600]">Projects.</em>
          </p>
        }
      />
    );
  }

  return (
    <>
      <GlobalEditDialog />
      <GlobalDeleteDialog />
      <div className={"w-full h-full text-white space-y-4"}>
        <CreateNewProjectContainer />
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:p-4 bg-navy-800 rounded-xl">
          <Suspense fallback={<Loading />}>
            {projects.map((item) => (
              <ProjectCard key={item._id} data={item} />
            ))}
          </Suspense>
        </section>
      </div>
    </>
  );
}

export default page;
