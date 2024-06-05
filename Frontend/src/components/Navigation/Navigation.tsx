import styles from "./Navigation.module.scss";
import NavigationLink from "./NavigationLink/NavigationLink.tsx";

const Navigation = () => {
    return (
        <div className={styles.navigation}>
            <NavigationLink to='/reports'>Отчеты</NavigationLink>
            <NavigationLink to='/templates'>Шаблоны</NavigationLink>
        </div>
    );
};

export default Navigation;