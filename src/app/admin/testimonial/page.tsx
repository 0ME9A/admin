import { TestimonialFace } from "@/ts/components";
import { Suspense } from "react";
import CreateNewTestimonialContainer from "@/components/Testimonial/CreateNewTestimonialContainer";
import GlobalDeleteDialog from "@/components/Testimonial/GlobalDeleteDialog";
import GlobalEditDialog from "@/components/Testimonial/GlobalEditDialog";
import TestimonialCard from "@/components/cards/TestimonialCard";
import FailedToFetch from "@/components/failed-to-fetch";
import Loading from "@/components/loading";

async function page() {
  let testimonial: TestimonialFace[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/testimonial`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch Testimonial.");

    const apiResponse = await res.json();
    testimonial = apiResponse.data;
  } catch (error) {
    console.error("Error fetching Testimonial:", error);
    return (
      <FailedToFetch
        message={
          <p className="text-[3rem] sm:text-[4rem] xl:text-[5rem] leading-none font-[200]">
            Failed to fetch <br />
            <em className="font-[600]">Testimonial.</em>
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
        <CreateNewTestimonialContainer />
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:p-4 bg-navy-800 rounded-xl">
          <Suspense fallback={<Loading />}>
            {testimonial.map((item) => (
              <TestimonialCard key={item._id} data={item} />
            ))}
          </Suspense>
        </section>
      </div>
    </>
  );
}

export default page;
