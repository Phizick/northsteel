import styles from './Dashboard.module.scss';
import Navigation from "../../../components/Navigation/Navigation.tsx";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import LayoutWrapper from "../LayoutWrapper/LayoutWrapper.tsx";
import {useEffect} from "react";

const DashboardPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === '/') {
            navigate('/reports');
        }
    }, [])

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