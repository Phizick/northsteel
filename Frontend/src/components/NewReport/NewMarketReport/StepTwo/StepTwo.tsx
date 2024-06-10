/// <reference types="vite-plugin-svgr/client" />
import styles from "./StepTwo.module.scss";
import { useContext, useState } from "react";
import { NewMarketReportContext } from "../../NewReport.tsx";
import NewReportBlock from "../../NewReportBlock/NewReportBlock.tsx";
import Button from "../../../../shared/Button/Button.tsx";
import { EditStatus } from "../../../../pages/Onboarding/ui/OnboardingSettings/OnboardingSettings.tsx";
import SourceForm from "../../../SourceForm/SourceForm.tsx";
import ButtonSimple from "../../../../shared/ButtonSimple/ButtonSimple.tsx";
import { useResize } from "../../../../hooks/useResize.tsx";
import Plus from "../../../../assets/images/icons/plus.svg?react";
import PlusWhite from "../../../../assets/images/icons/plus-white.svg?react";
import BlockForm from "../../BlockForm/BlockForm.tsx";

const StepTwo = () => {
  const { marketReportRequest } = useContext(NewMarketReportContext);

  const [editStatus, setEditStatus] = useState<EditStatus | null>(null);

  const { blocks } = marketReportRequest;

  const { isMobileScreen } = useResize();

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

  console.log(blocks);

  return (
    <div className={styles.step}>
      <div className={styles.blocks}>
        <ul className={styles.list}>
          {blocks.map((block, index) => (
            <li key={block.id}>
              <NewReportBlock block={block} />
            </li>
          ))}
        </ul>
        {editStatus === "adding" && <BlockForm />}
        {!editStatus && addButton()}
      </div>
      <div className={styles.stepFooter}>
        <Button
          className={styles.submitButton}
          onClick={() => {}}
          disabled={!marketReportRequest.blocks.length}
        >
          Создать отчет
        </Button>
      </div>
    </div>
  );
};

export default StepTwo;
