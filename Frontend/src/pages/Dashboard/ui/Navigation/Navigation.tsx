/// <reference types="vite-plugin-svgr/client" />
import styles from "./Navigation.module.scss";
import NavigationLink from "./NavigationLink/NavigationLink.tsx";
import HomeIcon from "../../../../assets/images/icons/home.svg?react";
import ReportIcon from "../../../../assets/images/icons/report.svg?react";
import TemplateIcon from "../../../../assets/images/icons/template.svg?react";
import SettingsIcon from "../../../../assets/images/icons/user-edit.svg?react";
import FaqIcon from "../../../../assets/images/icons/faq.svg?react";
import { useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const getIconClass = (to: string) => {
    if (location.pathname === to) {
      return styles.active;
    }

    return "";
  };

  return (
    <div className={styles.navigation}>
      <div className={styles.block}>
        <NavigationLink to="/your-reports">
          <HomeIcon className={getIconClass("/your-reports")} /> Ваши отчеты
        </NavigationLink>
        <NavigationLink to="/company-reports">
          <ReportIcon className={getIconClass("/company-reports")} /> Отчеты
          компании
        </NavigationLink>
        <NavigationLink to="/templates">
          <TemplateIcon className={getIconClass("/templates")} /> Шаблоны
        </NavigationLink>
      </div>
      <div className={styles.block}>
        <NavigationLink to="/settings">
          <SettingsIcon className={getIconClass("/settings")} /> Настройки
        </NavigationLink>
        <NavigationLink to="/faq">
          <FaqIcon className={getIconClass("/faq")} /> FAQ
        </NavigationLink>
      </div>
    </div>
  );
};

export default Navigation;
