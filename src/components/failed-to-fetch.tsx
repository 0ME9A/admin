import React from "react";

function FailedToFetch({ message }: { message: JSX.Element }) {
  return (
    <section className="container mx-auto p-4 space-y-8 sm:space-y-16 md:space-y-24 lg:space-y-32">
      <div className="space-y-6 text-center py-32">
        <h2 className="text-2xl text-gray-500 uppercase">Oops!</h2>
        {message}
      </div>
    </section>
  );
}

export default FailedToFetch;
