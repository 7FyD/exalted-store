"use client";
import { useRef, useState } from "react";

import { Chevron } from "../../icons/Chevron";

interface AccordionItemProps {
  title: string;
  message: string;
  isOpen: boolean;
  onClick: () => void;
}

import classes from "./index.module.scss";

const AccordionItem: React.FC<AccordionItemProps> = ({ title, message, isOpen, onClick }) => {
  const contentHeight = useRef<HTMLDivElement>(null);
  return (
    <div className={classes.wrapper}>
      <button
        className={`${classes.questionContainer} ${isOpen && classes.active}`}
        onClick={onClick}
      >
        <p className={classes.questionContent}>{title}</p>
        <Chevron className={`${classes.arrow} ${isOpen && classes.arrowRotate}`} />
      </button>

      <div
        ref={contentHeight}
        className={classes.answerContainer}
        style={isOpen ? { height: contentHeight.current.scrollHeight } : { height: "0px" }}
      >
        <p className={classes.answerContent}>{message}</p>
      </div>
    </div>
  );
};

export default AccordionItem;
