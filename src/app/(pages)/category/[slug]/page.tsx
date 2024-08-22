import React from "react";

import RanksPage from "../Ranks";

export default async function Page({ params: { slug = "ranks" } }) {
  return (
    <React.Fragment>
      {slug === "ranks" ? (
        <section className="space-y-8">
          <RanksPage />
        </section>
      ) : (
        <>
          <h2 className="text-center">Coming soon...</h2>
        </>
      )}
    </React.Fragment>
  );
}
