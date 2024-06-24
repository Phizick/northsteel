import styles from "./Links.module.scss";
import { LinksResponse } from "../../../../api/models/MarketReport.ts";

interface LinksViewProps {
  block: LinksResponse;
}

const LinksView = ({ block }: LinksViewProps) => {
  return (
    <div className={styles.block}>
      <div className={styles.row}>
        <p>Название компании</p>
        <p>Ссылка</p>
      </div>
      {block.data &&
        block.data.map((data, index) => (
          <div className={styles.row} key={index}>
            <p>{data.компания}</p>
            {data["ссылка на отчет"] ? (
              <a target="_blank" href={data["ссылка на отчет"]}>
                Открыть PDF
              </a>
            ) : (
              <p>Данные не найдены</p>
            )}
          </div>
        ))}
    </div>
  );
};

export default LinksView;
