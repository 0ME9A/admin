import React from "react";

function Loading() {
  return (
    <div className="w-full p-2 flex justify-center items-center">
      <div className="size-10 rounded-full border-2 border-white border-b-white/30 animate-spin" />
    </div>
  );
}

export default Loading;
