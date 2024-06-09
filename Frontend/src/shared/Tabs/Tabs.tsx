import styles from "./Tabs.module.scss";
import Tab from "./Tab/Tab.tsx";
import { Dispatch, SetStateAction } from "react";
import classnames from "classnames";

export interface Tab {
  value: string;
  title: string;
}

interface TabsProps {
  list: Tab[];
  active: Tab;
  setActive: Dispatch<SetStateAction<Tab>>;
  visualType?: "simple" | "shadow";
  additionalAction?: (tab: Tab) => void;
}

const Tabs = ({
  list,
  active,
  setActive,
  visualType = "simple",
  additionalAction,
}: TabsProps) => {
  const tabsClass = classnames({
    [styles.simple]: visualType === "simple",
    [styles.shadow]: visualType === "shadow",
  });

  return (
    <ul className={tabsClass}>
      {list.map((tab) => (
        <Tab
          key={tab.value}
          isActive={tab.value === active.value}
          onClick={() => {
            setActive(tab);
            if (additionalAction) {
              additionalAction(tab);
            }
          }}
          visualType={visualType}
        >
          {tab.title}
        </Tab>
      ))}
    </ul>
  );
};

export default Tabs;
