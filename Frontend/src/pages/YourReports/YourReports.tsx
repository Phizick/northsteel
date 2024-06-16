/// <reference types="vite-plugin-svgr/client" />
import styles from "./YourReports.module.scss";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader.tsx";
import Button from "../../shared/Button/Button.tsx";
import Plus from "../../assets/images/icons/plus-white.svg?react";
import Tabs, { Tab } from "../../shared/Tabs/Tabs.tsx";
import { useEffect, useState } from "react";
import NewReport from "../../components/NewReport/NewReport.tsx";
import { useStores } from "../../stores/root-store-context.ts";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import ReportCards from "../../components/ReportCards/ReportCards.tsx";
import Spinner from "../../shared/Spinner/Spinner.tsx";
import { SwipeableDrawer } from "@mui/material";

export const ReportsTabs: Tab[] = [
  {
    value: "market",
    title: "Обзоры рынка",
  },
  {
    value: "competitor",
    title: "Анализ конкурентов",
  },
];

const YourReports = () => {
  const [activeTab, setActiveTab] = useState<Tab>(ReportsTabs[0]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userStore, reportsStore } = useStores();

  useEffect(() => {
    (async () => {
      if (userStore.user) {
        await reportsStore.getUserReports(userStore.user?.user_id);
        runInAction(() => {
          reportsStore.isReady = true;
        });
      }
    })();
  }, [userStore.user]);

  const getReportsView = () => {
    if (reportsStore.isLoading) {
      return <Spinner />;
    }

    const filtered = reportsStore.userReports.filter(
      (report) => report.type === activeTab.value,
    );

    return filtered.length ? (
      <ReportCards reports={filtered} />
    ) : (
      <p>{`Вы пока не создали ни одного отчета типа "${activeTab.title}"`}</p>
    );
  };

  return (
    <>
      <ScreenHeader
        title="Ваши отчеты"
        button={
          <Button id={styles.createButton} onClick={() => setIsModalOpen(true)}>
            <Plus />
            Создать отчет
          </Button>
        }
        tabs={
          <Tabs
            list={ReportsTabs}
            active={activeTab}
            setActive={setActiveTab}
          />
        }
      />
      <div className={styles.viewContainer}>{getReportsView()}</div>
      <SwipeableDrawer
        anchor="right"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOpen={() => setIsModalOpen(true)}
      >
        <NewReport onClose={() => setIsModalOpen(false)} />
      </SwipeableDrawer>
    </>
  );
};

export default observer(YourReports);
