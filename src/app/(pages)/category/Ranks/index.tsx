import Image from "next/image";

import { Gutter } from "../../../_components/Gutter";

const RanksPage = () => {
  return (
    <Gutter>
      <h2 className="text-2xl font-semibold">Server ranks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          className="flex flex-col gap-4 bg-50% bg-top bg-no-repeat h-auto border-2 text-center p-2"
          // style={{ backgroundImage: `url(/media/mvp-plus.png)` }}
        >
          <Image
            src="/media/mvp-plus.png"
            alt="MVP+ Logo"
            className="mx-auto"
            width={190}
            height={190}
          />
          <h4 className="text-blue-300 text-lg font-semibold">MVP+</h4>
          <p className="text-sm">
            Enjoy small quality of life benefits and support the server! Receive this rank on our
            factions minecraft server and on the discord server
          </p>
          <p className="text-destructive line-through">$8.32</p>
          <p className="mt-[-16px]">$6.50</p>
        </div>
        <div className="h-80 border-2 text-center"></div>
        <div className="h-80 border-2 text-center"></div>
        <div className="h-80 border-2 text-center"></div>
      </div>
    </Gutter>
  );
};

export default RanksPage;
