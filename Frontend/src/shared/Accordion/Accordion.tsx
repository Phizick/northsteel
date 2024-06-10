/// <reference types="vite-plugin-svgr/client" />
import styles from "./Accordion.module.scss";
import { HTMLProps, useState } from "react";
import Icon from "../../assets/images/icons/chevron-up.svg?react";
import classnames from "classnames";

interface AccordionProps extends HTMLProps<HTMLDivElement> {
  title: string;
  initial?: boolean;
}

const Accordion = ({ title, initial = true, children }: AccordionProps) => {
  const [visible, setVisible] = useState(initial);

  const iconClass = classnames({
    [styles.reverse]: !visible,
  });

  return (
    <div>
      <h3 className={styles.title} onClick={() => setVisible(!visible)}>
        {title} <Icon className={iconClass} />
      </h3>
      {visible && children}
    </div>
  );
};

export default Accordion;
