import styles from "./LayoutWrapper.module.scss";
import { HTMLAttributes } from "react";
import classnames from "classnames";

type DashboardLayout = "logo" | "header" | "navigation" | "screens";

interface LayoutWrapperProps extends HTMLAttributes<HTMLElement> {
  layout: DashboardLayout;
}

const LayoutWrapper = ({ children, layout }: LayoutWrapperProps) => {
  const layoutClass = classnames({
    [styles[layout]]: true,
  });

  return <div className={layoutClass}>{children}</div>;
};

export default LayoutWrapper;
