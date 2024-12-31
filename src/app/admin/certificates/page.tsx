import { CertificateFace } from "@/ts/components";
import { Suspense } from "react";
import CreateNewCertificateContainer from "@/components/Certificates/CreateNewCertContainer";
import GlobalEditDialog from "@/components/Certificates/GlobalEditDialog";
import FailedToFetch from "@/components/failed-to-fetch";
import Loading from "@/components/loading";
import GlobalDeleteDialog from "@/components/Certificates/GlobalDeleteDialog";
import CertificateCard from "@/components/cards/CertificateCard";

async function page() {
  let certificates: CertificateFace[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_II}/admin/certificates`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch Certificates.");

    const apiResponse = await res.json();
    certificates = apiResponse;
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return (
      <FailedToFetch
        message={
          <p className="text-[3rem] sm:text-[4rem] xl:text-[5rem] leading-none font-[200]">
            Failed to fetch <br />
            <em className="font-[600]">Certificates.</em>
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
        <CreateNewCertificateContainer />
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:p-4 bg-navy-800 rounded-xl">
          <Suspense fallback={<Loading />}>
            {certificates.map((item) => (
              <CertificateCard data={item} key={item.certId} />
            ))}
          </Suspense>
        </section>
      </div>
    </>
  );
}

export default page;
