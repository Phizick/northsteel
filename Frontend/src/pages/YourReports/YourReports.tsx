/// <reference types="vite-plugin-svgr/client" />
import styles from "./YourReports.module.scss";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader.tsx";
import Button from "../../shared/Button/Button.tsx";
import Plus from "../../assets/images/icons/plus-white.svg?react";
import Tabs, { Tab } from "../../shared/Tabs/Tabs.tsx";
import { useState } from "react";
import Modal, { ModalFor } from "../../shared/Modal/Modal.tsx";
import NewReport from "../../components/NewReport/NewReport.tsx";

const yourReportsTabs: Tab[] = [
  {
    value: "reviews",
    title: "Обзоры рынка",
  },
  {
    value: "competitors",
    title: "Анализ конкурентов",
  },
];

const YourReports = () => {
  const [activeTab, setActiveTab] = useState<Tab>(yourReportsTabs[0]);

  const [isModalOpen, setIsModalOpen] = useState(false);

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
            list={yourReportsTabs}
            active={activeTab}
            setActive={setActiveTab}
          />
        }
      />
      {isModalOpen && (
        <Modal
          forType={ModalFor.PROFILE}
          closeModal={() => setIsModalOpen(false)}
        >
          <NewReport onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </>
  );
};

export default YourReports;
