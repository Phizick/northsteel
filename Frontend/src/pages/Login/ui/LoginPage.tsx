import styles from "./LoginPage.module.scss";
import LoginForm from "../../../components/Forms/LoginForm/LoginForm.tsx";
import Logo from "../../../shared/Logo/Logo.tsx";
import {useResize} from "../../../hooks/useResize.tsx";

const LoginPage = () => {
    const { isMobileScreen } = useResize();

    return (
        <main className={styles.page}>
            <section className={styles.auth}>
                <div className={styles.logoContainer}>
                    <Logo type='secondary' size={!isMobileScreen ? 'normal' : 'small'}/>
                </div>
                <div className={styles.loginContainer}>
                    <h1 className={styles.title}>Авторизация</h1>
                    <p className={styles.subtitle}>Введите логин и пароль, выданные представителем компании</p>
                    <LoginForm />
                </div>
                <div className={styles.copyrights}>
                    <p>ПАО «Северста́ль»</p>
                    <p>©Все права защищены 2024</p>
                </div>
            </section>
            {
                !isMobileScreen &&
                <div className={styles.picture}>
                    <div className={styles.overlay}></div>
                </div>
            }
        </main>
    );
};

export default LoginPage;