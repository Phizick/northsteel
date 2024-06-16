import styles from "./Templates.module.scss";
import { observer } from "mobx-react-lite";
import { useStores } from "../../stores/root-store-context.ts";
import { useEffect } from "react";
import ScreenHeader from "../../components/ScreenHeader/ScreenHeader.tsx";
import Spinner from "../../shared/Spinner/Spinner.tsx";
import TemplateCards from "../../components/TemplateCards/TemplateCards.tsx";

const Templates = () => {
  const { templatesStore } = useStores();

  useEffect(() => {
    (async () => {
      await templatesStore.getTemplates();
    })();
  }, []);

  const getTemplatesView = () => {
    if (templatesStore.isLoading) {
      return <Spinner />;
    }
    return templatesStore.templates.length ? (
      <TemplateCards templates={templatesStore.templates} />
    ) : (
      <p>{`Пока не создано ни одного шаблона`}</p>
    );
  };

  return (
    <div>
      <ScreenHeader title="Шаблоны для отчетов" />
      <div className={styles.viewContainer}>{getTemplatesView()}</div>
    </div>
  );
};

export default observer(Templates);
