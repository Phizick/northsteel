import styles from "./NavigationLink.module.scss";
import { Link, LinkProps, useLocation } from "react-router-dom";
import classnames from "classnames";

const NavigationLink = ({ to, children, ...props }: LinkProps) => {
  const { pathname } = useLocation();

  const linkClass = classnames({
    [styles.link]: true,
    [styles.active]: pathname.includes(to as string),
  });

  return (
    <Link className={linkClass} to={to} {...props}>
      {children}
    </Link>
  );
};

export default NavigationLink;
