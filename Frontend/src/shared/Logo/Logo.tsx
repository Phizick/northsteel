import styles from './Logo.module.scss';;
import MainLogo from '../../assets/images/logo-main.png';
import SecondaryLogo from '../../assets/images/logo-secondary.png';
import classnames from "classnames";

interface LogoProps {
    type: 'main' | 'secondary';
    size?: 'normal' | 'small'
}

const Logo = ({type, size = 'normal'}: LogoProps) => {
    const logoClass = classnames({
        [styles.logo]: true,
        [styles[size]]: true,
    })

    return (
        <img className={logoClass} src={type === "main" ? MainLogo : SecondaryLogo} alt="Логотип."/>
    );
};

export default Logo;