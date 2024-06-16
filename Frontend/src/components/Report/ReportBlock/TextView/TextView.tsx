import styles from "./TextView.module.scss";
import { TextResponse } from "../../../../api/models/MarketReport.ts";

interface TextViewProps {
  block: TextResponse;
}

const TextView = ({ block }: TextViewProps) => {
  const sources = block.data.links?.map((link) => link.url) || [];

  return (
    <div className={styles.view}>
      {Object.values(block.data.text.text).map((text, index) => (
        <p key={index} className={styles.text}>
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </p>
      ))}
      {sources.length ? (
        <p className={styles.sources} data-html2canvas-ignore="true">
          Источники:
          {sources.map((source, index) => (
            <a
              href={source}
              target="_blank"
              key={index}
              className={styles.link}
            >
              {`${index + 1}. ${source}`}
            </a>
          ))}
        </p>
      ) : null}
    </div>
  );
};

export default TextView;
