import styles from "./Tab.module.scss";
import { ButtonHTMLAttributes } from "react";
import classnames from "classnames";

interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  isActive: boolean;
  visualType: "simple" | "shadow";
}

const Tab = ({
  className = "",
  isActive,
  children,
  visualType,
  ...rest
}: TabProps) => {
  const tabClass = classnames({
    [styles.simple]: visualType === "simple",
    [styles.simple_active]: visualType === "simple" && isActive,
    [styles.shadow]: visualType === "shadow",
    [styles.shadow_active]: visualType === "shadow" && isActive,
    [className]: true,
  });

  const liClass = classnames({
    [styles.shadow__li]: visualType === "shadow",
  });

  return (
    <li className={liClass}>
      <button className={tabClass} {...rest}>
        {children}
      </button>
    </li>
  );
};

export default Tab;
