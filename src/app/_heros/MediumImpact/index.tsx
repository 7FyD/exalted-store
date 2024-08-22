import React from "react";

import { Page } from "../../../payload/payload-types";
import { Gutter } from "../../_components/Gutter";
import { CMSLink } from "../../_components/Link";
import { Media } from "../../_components/Media";
import RichText from "../../_components/RichText";

import classes from "./index.module.scss";

export const MediumImpactHero: React.FC<Page["hero"]> = props => {
  const { richText, media, links } = props;

  return (
    <Gutter className={classes.hero}>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <RichText className={classes.richText} content={richText} />
        {typeof media === "object" && <Media className={classes.media} resource={media} />}
      </div>
      <div className={classes.background}>
        {Array.isArray(links) && (
          <ul className={classes.links}>
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink className={classes.link} {...link} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Gutter>
  );
};
