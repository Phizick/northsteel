import styles from "./ProgressLine.module.scss";

interface ProgressLinePrpps {
  totalSteps: number;
  curStep: number;
}

const ProgressLine = ({ totalSteps, curStep }: ProgressLinePrpps) => {
  const blueLineLength = `${(curStep / totalSteps) * 100}%`;

  return (
    <div className={styles.progress}>
      <p>
        <span>{curStep}</span>
        <span> шаг из </span>
        <span>{totalSteps}</span>
      </p>
      <div className={styles.line}>
        <div
          className={styles.blueLine}
          style={{ width: blueLineLength }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressLine;
