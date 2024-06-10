/// <reference types="vite-plugin-svgr/client" />
import styles from "./StepTwo.module.scss";
import { useContext, useState } from "react";
import { NewMarketReportContext } from "../../NewReport.tsx";
import NewReportBlock from "../../NewReportBlock/NewReportBlock.tsx";
import Button from "../../../../shared/Button/Button.tsx";
import { EditStatus } from "../../../../pages/Onboarding/ui/OnboardingSettings/OnboardingSettings.tsx";
import ButtonSimple from "../../../../shared/ButtonSimple/ButtonSimple.tsx";
import { useResize } from "../../../../hooks/useResize.tsx";
import Plus from "../../../../assets/images/icons/plus.svg?react";
import PlusWhite from "../../../../assets/images/icons/plus-white.svg?react";
import BlockForm from "../../BlockForm/BlockForm.tsx";
import Accordion from "../../../../shared/Accordion/Accordion.tsx";

const StepTwo = () => {
  const { marketReportRequest } = useContext(NewMarketReportContext);

  const [editStatus, setEditStatus] = useState<EditStatus | null>(null);

  const [keyToEdit, setKeyToEdit] = useState<string | null>(null);

  const { blocks } = marketReportRequest;

  const { isMobileScreen } = useResize();

  const addButton = () => {
    if (isMobileScreen) {
      return (
        <Button
          className={styles.addButton}
          onClick={() => setEditStatus("adding")}
        >
          <PlusWhite /> Добавить новый блок
        </Button>
      );
    }

    return (
      <ButtonSimple onClick={() => setEditStatus("adding")}>
        <Plus /> Добавить новый блок
      </ButtonSimple>
    );
  };

  console.log(editStatus);

  return (
    <div className={styles.step}>
      <div className={styles.blocks}>
        <Accordion title="Основные блоки (редактирование закрыто)">
          <ul className={styles.list}>
            {blocks
              .filter((block) => block.isDefault)
              .map((block) =>
                keyToEdit !== block.id ? (
                  <li key={block.id}>
                    <NewReportBlock
                      setKeyToEdit={setKeyToEdit}
                      setEditStatus={setEditStatus}
                      block={block}
                      editStatus={editStatus}
                    />
                  </li>
                ) : (
                  <li key={block.id}>
                    <BlockForm
                      setEditStatus={setEditStatus}
                      setKeyToEdit={setKeyToEdit}
                      initialBlock={block}
                    />
                  </li>
                ),
              )}
          </ul>
        </Accordion>
        <Accordion title="Дополнительные блоки">
          <ul className={styles.list}>
            {blocks
              .filter((block) => !block.isDefault)
              .map((block) =>
                keyToEdit !== block.id ? (
                  <li key={block.id}>
                    <NewReportBlock
                      setKeyToEdit={setKeyToEdit}
                      setEditStatus={setEditStatus}
                      block={block}
                      editStatus={editStatus}
                    />
                  </li>
                ) : (
                  <li key={block.id}>
                    <BlockForm
                      setEditStatus={setEditStatus}
                      setKeyToEdit={setKeyToEdit}
                      initialBlock={block}
                    />
                  </li>
                ),
              )}
          </ul>
          {editStatus === "adding" && (
            <BlockForm
              setEditStatus={setEditStatus}
              setKeyToEdit={setKeyToEdit}
            />
          )}
          {!editStatus && addButton()}
        </Accordion>
      </div>
      <div className={styles.stepFooter}>
        <Button
          className={styles.submitButton}
          onClick={() => {}}
          disabled={!marketReportRequest.blocks.length || !!editStatus}
        >
          Создать отчет
        </Button>
      </div>
    </div>
  );
};

export default StepTwo;
