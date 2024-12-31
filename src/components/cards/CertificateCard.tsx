"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CertificateFace } from "@/ts/components";
import { getDateMonthYear } from "@/utils/utils";
import PrimaryBtn from "../buttons/PrimaryBtn";
import Image from "next/image";

interface TestimonialCardProps {
  data: CertificateFace;
  className?: string;
}

function CertificateCard({ data, className }: TestimonialCardProps) {
  const {
    name,
    title,
    desc,
    certId,
    certSrc,
    createdAt,
    updatedAt,
    _id,
    issueDate,
  } = data;
  const issueDateTime = new Date(issueDate || "");
  const createdAtTime = new Date(createdAt || "");
  const updatedAtTime = new Date(updatedAt || "");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleAction = (action: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("id", _id);
    newParams.set("name", name);
    newParams.set("action", action);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <div
      className={`relative group bg-white dark:bg-navy-900 hover:bg-accent-500 duration-300 rounded-xl ${className}`}
    >
      <div className="relative p-4 md:p-6 items-start gap-4 md:gap-6">
        {certSrc ? (
          <Image
            src={`data:image/jpeg;base64,${certSrc}`}
            alt={`${name} profile`}
            width={100}
            height={100}
            quality={100}
            blurDataURL="data:..."
            placeholder="blur"
            className="w-full object-cover rounded-sm"
          />
        ) : (
          <div className="size-16 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
        <div className="w-full mt-2">
          <h3 className="text-xl md:text-2xl uppercase font-[500] py-1">
            Type: <span>{title}</span>
          </h3>
          {name && (
            <p className="text-gray-500 dark:text-gray-200">
              Name: <span>{name}</span>
            </p>
          )}
          {certId && (
            <p className="text-gray-500 dark:text-gray-200">
              Certificate Id: <span>{certId}</span>
            </p>
          )}
          {desc && (
            <p className="py-4">
              Description: <span>{desc}</span>
            </p>
          )}
          <div className="flex justify-between items-center">
            <p className="text-gray-800 dark:text-white">
              Issue Date: <span>{getDateMonthYear(issueDateTime)}</span>
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-500 dark:text-gray-200">
              Created At: <span>{getDateMonthYear(createdAtTime)}</span>
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-500 dark:text-gray-200">
              Updated At: <span>{getDateMonthYear(updatedAtTime)}</span>
            </p>
          </div>
        </div>
      </div>
      <div className={"flex items-center justify-end p-2 sm:p-4 gap-2"}>
        <PrimaryBtn onClick={() => handleAction("edit")}>Edit</PrimaryBtn>
        <PrimaryBtn onClick={() => handleAction("delete")}>Delete</PrimaryBtn>
      </div>
    </div>
  );
}

export default CertificateCard;
