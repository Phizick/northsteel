import styles from "./Logo.module.scss";
import MainLogo from "../../assets/images/logo-main.png";
import SecondaryLogo from "../../assets/images/logo-secondary.png";
import LogoMobile from "../../assets/images/logo-mobile.png";
import classnames from "classnames";

type LogoType = "main" | "secondary" | "mobile";

interface LogoProps {
  type: LogoType;
  size?: "normal" | "small";
  className?: string;
}

const Logo = ({ type, size = "normal", className = "" }: LogoProps) => {
  const logoClass = classnames({
    [styles.logo]: true,
    [styles[`${type}_${size}`]]: true,
    [className]: true,
  });

  let logoSrc;

  switch (type) {
    case "main":
      logoSrc = MainLogo;
      break;
    case "secondary":
      logoSrc = SecondaryLogo;
      break;
    case "mobile":
      logoSrc = LogoMobile;
      break;
  }

  return <img className={logoClass} src={logoSrc} alt="Логотип." />;
};

export default Logo;
