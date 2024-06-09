import styles from "./OnboardingSettings.module.scss";
import MultiSelect, {
  Option,
} from "../../../../shared/MultiSelect/MultiSelect.tsx";
import { useState } from "react";
import { useStores } from "../../../../stores/root-store-context.ts";
import { ActionMeta, MultiValue } from "react-select";
import Spinner from "../../../../shared/Spinner/Spinner.tsx";
import { observer } from "mobx-react-lite";
import OnboardingSources from "./OnboardingSources/OnboardingSources.tsx";
import Button from "../../../../shared/Button/Button.tsx";
import { thematics } from "../../../../utils/variables.ts";

const defaultThematics: Option[] = [
  {
    id: "1",
    value: "Металлургия",
    label: "Металлургия",
  },
  {
    id: "2",
    value: "Финансовый сектор",
    label: "Финансовый сектор",
  },
];

export type EditStatus = "adding" | "editing";

const OnboardingSettings = () => {
  const { userStore } = useStores();

  if (!userStore.user) {
    return <Spinner />;
  }

  const [selectedThematics, setSelectedThematics] =
    useState<Option[]>(defaultThematics);

  const [editStatus, setEditStatus] = useState<EditStatus | null>(null);

  const options: Option[] = thematics.map((thematic) => ({
    ...thematic,
    label: thematic.value,
  }));

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Первичная настройка</h1>
        <p className={styles.subtitle}>
          Для продолжения необходимо настроить аккаунт
        </p>
        <div className={styles.forms}>
          <MultiSelect
            options={options}
            title="Укажите тематики для исследований"
            selectedOptions={selectedThematics}
            setSelectedOptions={
              setSelectedThematics as unknown as (
                newValue: MultiValue<Option>,
                actionMeta: ActionMeta<Option>,
              ) => void
            }
            placeholder="Выберите сферу исследований"
          />
          <div>
            <p className={styles.sources}>
              Укажите приоритетные источники информации
            </p>
            <p className={styles.notification}>
              Закрытым источникам нужно время для активации (до 30 минут), мы
              уведомим Вас, когда источник будет активирован
            </p>
            <OnboardingSources
              editStatus={editStatus}
              setEditStatus={setEditStatus}
            />
          </div>
          {!editStatus && (
            <Button className={styles.button}>Сохранить и продолжить</Button>
          )}
        </div>
      </div>
    </main>
  );
};

export default observer(OnboardingSettings);
