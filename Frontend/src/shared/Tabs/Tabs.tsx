import styles from "./Tabs.module.scss";
import Tab from "./Tab/Tab.tsx";
import { Dispatch, SetStateAction } from "react";

export interface Tab {
  value: string;
  title: string;
}

interface TabsProps {
  list: Tab[];
  active: Tab;
  setActive: Dispatch<SetStateAction<Tab>>;
}

const Tabs = ({ list, active, setActive }: TabsProps) => {
  return (
    <ul className={styles.tabs}>
      {list.map((tab) => (
        <Tab
          key={tab.value}
          isActive={tab.value === active.value}
          onClick={() => setActive(tab)}
        >
          {tab.title}
        </Tab>
      ))}
    </ul>
  );
};

export default Tabs;
