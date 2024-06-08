import styles from "./Tab.module.scss";
import { ButtonHTMLAttributes } from "react";
import classnames from "classnames";

interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  isActive: boolean;
}

const Tab = ({ className = "", isActive, children, ...rest }: TabProps) => {
  const tabClass = classnames({
    [styles.tab]: true,
    [styles.active]: isActive,
    [className]: true,
  });

  return (
    <li>
      <button className={tabClass} {...rest}>
        {children}
      </button>
    </li>
  );
};

export default Tab;
