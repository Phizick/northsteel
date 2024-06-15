import { observer } from "mobx-react-lite";
import { useStores } from "../../stores/root-store-context.ts";

const Templates = () => {
  const { templatesStore } = useStores();

  console.log(templatesStore.templates);

  return <div>Шаблоны</div>;
};

export default observer(Templates);
