import styles from "./TemplateCards.module.scss";
import TemplateCard, { ITemplate } from "./TemplateCard/TemplateCard.tsx";

interface TemplateCards {
  templates: ITemplate[];
}

const TemplateCards = ({ templates }: TemplateCards) => {
  return (
    <ul className={styles.cards}>
      {templates.map((template) => (
        <li key={template.template_id}>
          <TemplateCard
            title={template.title}
            body={template.body}
            template_id={template.template_id}
          />
        </li>
      ))}
    </ul>
  );
};

export default TemplateCards;
