import styles from "./ScreenHeader.module.scss";
import { ReactElement } from "react";

interface ScreenHeaderProps {
  title: string;
  button?: ReactElement;
  tabs: ReactElement;
}

const ScreenHeader = ({ title, button, tabs }: ScreenHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.titleContainer}>
        <h1>{title}</h1>
        {button && button}
      </div>
      {tabs}
    </div>
  );
};

export default ScreenHeader;
