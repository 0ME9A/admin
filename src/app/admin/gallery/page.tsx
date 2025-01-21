import { GalleryFace, PaginationFace } from "@/ts/components";
import { Suspense } from "react";
import CreateNewGalleryContainer from "@/components/Gallery/CreateNewGalleryContainer";
import GlobalDeleteDialog from "@/components/Gallery/GlobalDeleteDialog";
import GlobalEditDialog from "@/components/Gallery/GlobalEditDialog";
import GalleryCard from "@/components/cards/GalleryCard";
import FailedToFetch from "@/components/failed-to-fetch";
import Pagination from "@/components/Pagination";
import Loading from "@/components/loading";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function Page(props: { params: Params; searchParams: SearchParams }) {
  let gallery: GalleryFace[] = [];
  const searchParams = await props.searchParams;

  let pagination: PaginationFace = {
    totalProjects: 0,
    totalPages: 0,
    currentPage: 0,
    limit: 0,
  };
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/gallery?page=${
        searchParams?.page || 1
      }`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch Gallery.");

    const apiResponse = await res.json();
    gallery = apiResponse.data;
    pagination = apiResponse.pagination;
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return (
      <FailedToFetch
        message={
          <p className="text-[3rem] sm:text-[4rem] xl:text-[5rem] leading-none font-[200]">
            Failed to fetch <br />
            <em className="font-[600]">Gallery.</em>
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
        <CreateNewGalleryContainer />
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:p-4 bg-navy-800 rounded-xl">
          <Suspense fallback={<Loading />}>
            {gallery.map((item) => (
              <GalleryCard key={item._id} data={item} />
            ))}
          </Suspense>
        </section>
        <Pagination
          totalPages={pagination.totalPages}
          currentPage={pagination.currentPage}
        />
      </div>
    </>
  );
}

export default Page;
