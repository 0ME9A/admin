"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TestimonialFace } from "@/ts/components";
import { getDateMonthYear } from "@/utils/utils";
import PrimaryBtn from "../buttons/PrimaryBtn";
import StarRating from "../StarRating";
import Image from "next/image";

interface TestimonialCardProps {
  data: TestimonialFace;
  className?: string;
}

function TestimonialCard({ data, className }: TestimonialCardProps) {
  const { name, profession, message, rate, date, profile } = data;
  const dateTime = new Date(date);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleAction = (action: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("id", data._id);
    newParams.set("name", data.name);
    newParams.set("action", action);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <div
      className={`relative group bg-white dark:bg-navy-900 hover:bg-accent-500 duration-300 rounded-xl ${className}`}
    >
      <div className="relative p-4 md:p-6 items-start gap-4 md:gap-6">
        {profile ? (
          <Image
            src={`data:image/jpeg;base64,${profile}`}
            alt={`${name} profile`}
            width={100}
            height={100}
            quality={100}
            blurDataURL="data:..."
            placeholder="blur"
            className="size-16 object-cover aspect-square rounded-full"
          />
        ) : (
          <div className="size-16 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
        <div className="w-full mt-2">
          <h3 className="text-xl md:text-2xl uppercase font-[500] py-1">
            {name}
          </h3>
          {profession && (
            <p className="text-gray-500 dark:text-gray-200">{profession}</p>
          )}
          {message && <p className="py-4">{message}</p>}
          <div className="flex justify-between items-center">
            <div className="flex text-xl">{<StarRating rating={rate} />}</div>
            <p className="text-gray-500 dark:text-gray-200">
              {getDateMonthYear(dateTime)}
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

export default TestimonialCard;
