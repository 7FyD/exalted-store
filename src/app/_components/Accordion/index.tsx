"use client";

import { useState } from "react";

import { AdditionalInformation } from "../../../payload/payload-types";
import AccordionItem from "./AccordionItem";

import classes from "./index.module.scss";

interface AccordionProps {
  data: AdditionalInformation;
}

const Accordion: React.FC<AccordionProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const handleItemClick = index => {
    setActiveIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <div className={classes.container}>
      {data !== null &&
        data.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            message={item.message}
            isOpen={activeIndex === index}
            onClick={() => handleItemClick(index)}
          />
        ))}
    </div>
  );
};

export default Accordion;
