"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProjectFace } from "@/ts/components";
import Image from "next/image";
import PrimaryBtn from "../buttons/PrimaryBtn";

interface CardFace {
  data: ProjectFace;
  className?: string;
}

function ProjectCard({ data, className }: CardFace) {
  const { title, previewImages, desc, date, address, status } = data;
  const setDate = new Date(date);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleAction = (action: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("id", data._id);
    newParams.set("title", data.title);
    newParams.set("action", action);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {previewImages[0] ? (
        <Image
          src={`data:image/jpeg;base64,${previewImages[0]}`}
          alt={title}
          width={500}
          height={500}
          quality={100}
          blurDataURL="data:..."
          placeholder="blur"
          className="w-full h-full object-cover aspect-square clip-path-penta-tl-sm md:clip-path-penta-tl-md"
        />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}

      <span className="w-full h-full absolute top-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
      <div className="h-16"></div>
      <div className="absolute top-2 right-2 p-2 py-1 bg-navy-900/20 flex justify-center items-center gap-2 text-xs rounded-full text-white">
        <div className="size-2 bg-accent-500 rounded-full animate-pulse" />
        <p>{status}</p>
      </div>
      <div className="w-full absolute bottom-0 p-3 text-white">
        <h2 className="text-xl uppercase font-[500]">{title}</h2>
        <div className="flex justify-between text-md font-[200] text-xs">
          <span>{address}</span>
          <span className="opacity-75">Year {setDate.getFullYear()}</span>
        </div>
        <p className="py-2">{desc}</p>
        <div className={"flex items-center gap-2"}>
          <PrimaryBtn onClick={() => handleAction("edit")}>Edit</PrimaryBtn>
          <PrimaryBtn onClick={() => handleAction("delete")}>Delete</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
