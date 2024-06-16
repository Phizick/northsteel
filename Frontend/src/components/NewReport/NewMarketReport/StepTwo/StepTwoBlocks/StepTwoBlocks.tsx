import { Dispatch, SetStateAction, useState } from "react";
import { EditStatus } from "../../../../Settings/Settings.tsx";
import { useResize } from "../../../../../hooks/useResize.tsx";
import Button from "../../../../../shared/Button/Button.tsx";
import styles from "./StepTwoBlocks.module.scss";
import ButtonSimple from "../../../../../shared/ButtonSimple/ButtonSimple.tsx";
import Accordion from "../../../../../shared/Accordion/Accordion.tsx";
import NewReportBlock from "../../../NewReportBlock/NewReportBlock.tsx";
import BlockForm from "../../../BlockForm/BlockForm.tsx";
import Plus from "../../../../../assets/images/icons/plus.svg?react";
import PlusWhite from "../../../../../assets/images/icons/plus-white.svg?react";
import { MarketReportRequest } from "../../../../../api/models/MarketReport.ts";

interface StepProps {
  request: MarketReportRequest;
  setMarketReportRequest:
    | Dispatch<SetStateAction<MarketReportRequest>>
    | ((request: MarketReportRequest) => void);
  editStatus: EditStatus | null;
  setEditStatus: Dispatch<SetStateAction<EditStatus | null>>;
}

const StepTwoBlocks = ({
  request: marketReportRequest,
  setMarketReportRequest,
  editStatus,
  setEditStatus,
}: StepProps) => {
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
      <ButtonSimple
        className={styles.addButton}
        onClick={() => setEditStatus("adding")}
      >
        <Plus /> Добавить новый блок
      </ButtonSimple>
    );
  };

  return (
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
                    marketReportRequest={marketReportRequest}
                    setMarketReportRequest={setMarketReportRequest}
                  />
                </li>
              ) : (
                <li key={block.id}>
                  <BlockForm
                    setEditStatus={setEditStatus}
                    setKeyToEdit={setKeyToEdit}
                    initialBlock={block}
                    marketReportRequest={marketReportRequest}
                    setMarketReportRequest={setMarketReportRequest}
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
                    marketReportRequest={marketReportRequest}
                    setMarketReportRequest={setMarketReportRequest}
                  />
                </li>
              ) : (
                <li key={block.id}>
                  <BlockForm
                    setEditStatus={setEditStatus}
                    setKeyToEdit={setKeyToEdit}
                    initialBlock={block}
                    marketReportRequest={marketReportRequest}
                    setMarketReportRequest={setMarketReportRequest}
                  />
                </li>
              ),
            )}
        </ul>
        {editStatus === "adding" && (
          <BlockForm
            setEditStatus={setEditStatus}
            setKeyToEdit={setKeyToEdit}
            marketReportRequest={marketReportRequest}
            setMarketReportRequest={setMarketReportRequest}
          />
        )}
        {!editStatus && addButton()}
      </Accordion>
    </div>
  );
};

export default StepTwoBlocks;
