import { Page } from "../../../payload/payload-types";
import { Gutter } from "../../_components/Gutter";
import { Media } from "../../_components/Media";

export const HighImpactHero: React.FC<Page["hero"]> = ({ richText, media, links }) => {
  return (
    <Gutter className="flex flex-col">
      <div
        className={`w-full mx-auto hidden md:block hover:cursor-pointer hover:scale-105 transition-transform`}
      >
        {typeof media === "object" && (
          <Media
            resource={media}
            imgClassName="max-h-96 h-96 object-cover border-2 border-[#ffc376]"
            priority
          />
        )}
      </div>
    </Gutter>
  );
};
