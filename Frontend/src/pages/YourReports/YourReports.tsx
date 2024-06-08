/// <reference types="vite-plugin-svgr/client" />
import styles from "./YourReports.module.scss";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader.tsx";
import Button from "../../shared/Button/Button.tsx";
import Plus from "../../assets/images/icons/plus-white.svg?react";
import Tabs, { Tab } from "../../shared/Tabs/Tabs.tsx";
import { useState } from "react";

const yourReportsTabs: Tab[] = [
  {
    value: "reviews",
    title: "Обзоры рынка",
  },
  {
    value: "competitors",
    title: "Анализ конкурентов",
  },
  {
    value: "drafts",
    title: "Черновики",
  },
];

const YourReports = () => {
  const [activeTab, setActiveTab] = useState<Tab>(yourReportsTabs[0]);

  return (
    <>
      <ScreenHeader
        title="Ваши отчеты"
        button={
          <Button id={styles.createButton}>
            <Plus />
            Создать отчет
          </Button>
        }
        tabs={
          <Tabs
            list={yourReportsTabs}
            active={activeTab}
            setActive={setActiveTab}
          />
        }
      />
    </>
  );
};

export default YourReports;
