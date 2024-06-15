import { useState } from "react";
import { useStores } from "../../stores/root-store-context.ts";
import Spinner from "../../shared/Spinner/Spinner.tsx";
import MultiSelect, { Option } from "../../shared/MultiSelect/MultiSelect.tsx";
import { Thematic, TrustedSource } from "../../api/models/User.ts";
import { thematics } from "../../utils/variables.ts";
import styles from "../../pages/Onboarding/ui/OnboardingSettings/OnboardingSettings.module.scss";
import { ActionMeta, MultiValue } from "react-select";
import Sources from "./Sources/Sources.tsx";
import Button from "../../shared/Button/Button.tsx";
import { observer } from "mobx-react-lite";

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

const defaultSources: TrustedSource[] = [
  {
    title: "РБК",
    url: "https://rbc.ru",
    isDefault: true,
    authEnabled: false,
  },
];

const Settings = () => {
  const { userStore } = useStores();

  if (!userStore.user) {
    return <Spinner />;
  }

  const [selectedThematics, setSelectedThematics] = useState<Option[]>(
    userStore.user.verification
      ? userStore.user.thematics.map((thematic) => ({
          id: thematic.id,
          value: thematic.value,
          label: thematic.value,
        }))
      : defaultThematics,
  );
  const [sources, setSources] = useState<TrustedSource[]>(
    userStore.user.verification
      ? userStore.user.trusted_sources
      : defaultSources,
  );

  const [editStatus, setEditStatus] = useState<EditStatus | null>(null);

  const options: Option[] = thematics.map((thematic) => ({
    ...thematic,
    label: thematic.value,
  }));

  const handleSubmit = async () => {
    if (userStore.user) {
      await userStore.patchUser(userStore.user?.user_id, {
        thematics: selectedThematics.map((thematic) =>
          thematics.find((them) => them.value === thematic.value),
        ) as Thematic[],
        trusted_sources: sources,
        verification: true,
      });
    }
  };

  return (
    <div className={styles.forms}>
      <div className={styles.container}>
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
          placeholder="Выберите тематику исследований"
        />
        <div>
          <p className={styles.sources}>
            Укажите приоритетные источники информации
          </p>
          <p className={styles.notification}>
            Закрытым источникам нужно время для активации (до 30 минут), мы
            уведомим Вас, когда источник будет активирован
          </p>
          <Sources
            editStatus={editStatus}
            setEditStatus={setEditStatus}
            sources={sources}
            setSources={setSources}
          />
        </div>
      </div>
      {!editStatus && (
        <Button
          disabled={userStore.isLoading}
          className={styles.button}
          onClick={handleSubmit}
          isLoading={userStore.isLoading}
        >
          {userStore.user?.verification
            ? "Сохранить"
            : "Сохранить и продолжить"}
        </Button>
      )}
    </div>
  );
};

export default observer(Settings);
