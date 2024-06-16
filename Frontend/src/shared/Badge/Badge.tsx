import styles from "./Badge.module.scss";
import { HTMLAttributes } from "react";
import classnames from "classnames";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  visualType?: "common" | "blue";
}

const Badge = ({ visualType = "common", children }: BadgeProps) => {
  const badgeClass = classnames({
    [styles.badge]: true,
    [styles[visualType]]: true,
  });

  return <div className={badgeClass}>{children}</div>;
};

export default Badge;
