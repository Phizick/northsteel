import styles from './Dashboard.module.scss';
import Navigation from "../../../components/Navigation/Navigation.tsx";
import {Outlet} from "react-router-dom";
import LayoutWrapper from "../LayoutWrapper/LayoutWrapper.tsx";

const DashboardPage = () => {
    return (
        <main className={styles.page}>
            <LayoutWrapper layout='navigation'>
                <Navigation/>
            </LayoutWrapper>
            <LayoutWrapper layout='main'>
                <Outlet/>
            </LayoutWrapper>
        </main>
    );
};

export default DashboardPage;