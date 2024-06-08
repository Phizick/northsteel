/// <reference types="vite-plugin-svgr/client" />
import styles from "./OnboardingSources.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import { TrustedSource } from "../../../../../api/models/User.ts";
import Source from "../../../../../components/Source/Source.tsx";
import Plus from "../../../../../assets/images/icons/plus.svg?react";
import PlusWhite from "../../../../../assets/images/icons/plus-white.svg?react";
import ButtonSimple from "../../../../../shared/ButtonSimple/ButtonSimple.tsx";
import SourceForm from "../../../../../components/SourceForm/SourceForm.tsx";
import { EditStatus } from "../OnboardingSettings.tsx";
import { useResize } from "../../../../../hooks/useResize.tsx";
import Button from "../../../../../shared/Button/Button.tsx";

const defaultSources: TrustedSource[] = [
  {
    title: "РБК",
    url: "https://rbc.ru",
    isDefault: true,
    authEnabled: false,
  },
];

interface OnboardingSourcesProps {
  editStatus: EditStatus | null;
  setEditStatus: Dispatch<SetStateAction<EditStatus | null>>;
}

const OnboardingSources = ({
  editStatus,
  setEditStatus,
}: OnboardingSourcesProps) => {
  const [sources, setSources] = useState<TrustedSource[]>(defaultSources);
  const [keyToEdit, setKeyToEdit] = useState<number | null>(null);

  const { isMobileScreen } = useResize();

  const deleteSource = (url: string) => {
    setSources(sources.filter((source) => source.url !== url));
  };

  const handleEditButton = (keyToEdit: number) => {
    setEditStatus("editing");
    setKeyToEdit(keyToEdit);
  };

  const addButton = () => {
    if (isMobileScreen) {
      return (
        <Button
          className={styles.addButton}
          onClick={() => setEditStatus("adding")}
        >
          <PlusWhite /> Добавить новый источник
        </Button>
      );
    }

    return (
      <ButtonSimple onClick={() => setEditStatus("adding")}>
        <Plus /> Добавить новый источник
      </ButtonSimple>
    );
  };

  return (
    <div>
      <ul className={styles.sources}>
        {sources.map((source: TrustedSource, index) =>
          keyToEdit !== index ? (
            <Source
              key={index}
              source={source}
              onEditClick={handleEditButton}
              keyToEdit={index}
              onDeleteClick={deleteSource}
            />
          ) : (
            <SourceForm
              key={index}
              editStatus={editStatus}
              setEditStatus={setEditStatus}
              sources={sources}
              setSources={setSources}
              keyToEdit={keyToEdit}
              setKeyToEdit={setKeyToEdit}
              initialValues={source}
            />
          ),
        )}
      </ul>
      {editStatus === "adding" && (
        <SourceForm
          sources={sources}
          editStatus={editStatus}
          setEditStatus={setEditStatus}
          setSources={setSources}
        />
      )}
      {!editStatus && addButton()}
    </div>
  );
};

export default OnboardingSources;
