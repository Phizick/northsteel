import styles from "./TextView.module.scss";
import { TextResponse } from "../../../../api/models/MarketReport.ts";

interface TextViewProps {
  block: TextResponse;
}

const TextView = ({ block }: TextViewProps) => {
  const sources = block.data.links.map((link) => link.url);

  return (
    <div className={styles.view}>
      <p className={styles.text}>Описание</p>
      {Object.values(block.data.text.text).map((text, index) => (
        <p key={index} className={styles.text}>
          {text}
        </p>
      ))}
      <p className={styles.sources} data-html2canvas-ignore="true">
        Источники:
        {sources.map((source, index) => (
          <a href={source} target="_blank" key={index} className={styles.link}>
            {`${index + 1}. ${source}`}
          </a>
        ))}
      </p>
    </div>
  );
};

export default TextView;
