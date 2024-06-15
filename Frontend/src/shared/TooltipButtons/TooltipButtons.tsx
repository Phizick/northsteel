/// <reference types="vite-plugin-svgr/client" />
import styles from "./TooltipButtons.module.scss";
import DotsIcon from "../../assets/images/icons/dots.svg?react";
import ButtonSimple from "../ButtonSimple/ButtonSimple.tsx";
import { HTMLAttributes, useState } from "react";

const TooltipButtons = ({ children }: HTMLAttributes<HTMLDivElement>) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={styles.tooltipButtons}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      <ButtonSimple visualType="common">
        {" "}
        <DotsIcon />
        {isHovered && <div className={styles.buttons}>{children}</div>}
      </ButtonSimple>
    </div>
  );
};

export default TooltipButtons;
