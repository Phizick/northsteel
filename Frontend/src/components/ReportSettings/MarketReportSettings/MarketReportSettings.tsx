/// <reference types="vite-plugin-svgr/client" />
import { Dispatch, SetStateAction, useState } from "react";
import { MarketReportRequest } from "../../../api/models/MarketReport.ts";
import styles from "./MarketReportSettings.module.scss";
import Input from "../../../shared/Input/Input.tsx";
import Select from "../../../shared/Select/Select.tsx";
import { useStores } from "../../../stores/root-store-context.ts";
import { autoupdateOptions, thematics } from "../../../utils/variables.ts";
import { Thematic } from "../../../api/models/User.ts";
import { Option } from "../../../shared/MultiSelect/MultiSelect.tsx";
import { SingleValue } from "react-select";
import { periodOptions } from "../../NewReport/NewMarketReport/StepOne/StepOneForms/StepOneForms.tsx";
import Checkbox from "../../../shared/Checkbox/Checkbox.tsx";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";
import Accordion from "../../../shared/Accordion/Accordion.tsx";
import NewReportBlock from "../../NewReport/NewReportBlock/NewReportBlock.tsx";
import BlockForm from "../../NewReport/BlockForm/BlockForm.tsx";
import { EditStatus } from "../../Settings/Settings.tsx";
import { useResize } from "../../../hooks/useResize.tsx";
import Button from "../../../shared/Button/Button.tsx";
import ButtonSimple from "../../../shared/ButtonSimple/ButtonSimple.tsx";
import Plus from "../../../assets/images/icons/plus.svg?react";
import PlusWhite from "../../../assets/images/icons/plus-white.svg?react";

interface SettingsProps {
  currentState: MarketReportRequest;
  setCurrentState: Dispatch<SetStateAction<MarketReportRequest>>;
  setDateFromError: Dispatch<SetStateAction<boolean>>;
  setDateToError: Dispatch<SetStateAction<boolean>>;
  editStatus: EditStatus | null;
  setEditStatus: Dispatch<SetStateAction<EditStatus | null>>;
}

const MarketReportSettings = ({
  currentState,
  setCurrentState,
  setDateToError,
  setDateFromError,
  editStatus,
  setEditStatus,
}: SettingsProps) => {
  const { userStore } = useStores();

  const [keyToEdit, setKeyToEdit] = useState<string | null>(null);

  const { blocks } = currentState;

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

  const getMarketOptions = () => {
    if (userStore.user?.thematics) {
      return userStore.user?.thematics.map((thematic) => ({
        ...thematic,
        label: thematic.value,
      }));
    }

    return thematics.map((thematic) => ({
      ...thematic,
      label: thematic.value,
    }));
  };

  const getNicheOptions = () => {
    if (currentState.market) {
      const market: Thematic = thematics.find(
        (market) => market.value === currentState.market,
      ) as Thematic;
      return [
        { value: "", label: "Все" },
        ...market.niches.map((niche) => ({
          value: niche,
          label: niche,
        })),
      ];
    }

    return [];
  };

  const getSelected = (value: string): Option | null => {
    if (value) {
      return {
        value,
        label: value,
      };
    }

    return null;
  };

  const getSelectedPeriodBy = (value: string): Option | null => {
    if (value) {
      return {
        value,
        label: periodOptions.find((option) => option.value === value)
          ?.label as string,
      };
    }

    return null;
  };

  const getAutoUpdateBy = (value: string): Option | null => {
    if (value) {
      return {
        value,
        label: autoupdateOptions.find((option) => option.value == value)
          ?.label as string,
      };
    }

    return null;
  };

  const setSelectedMarket = (option: SingleValue<Option>): void => {
    setCurrentState({
      ...currentState,
      market: option?.value || "",
    });
  };

  const setSelectedNiche = (option: SingleValue<Option>): void => {
    setCurrentState({
      ...currentState,
      marketNiche: option?.value || "",
    });
  };

  const setSelectedPeriodBy = (option: SingleValue<Option>): void => {
    setCurrentState({
      ...currentState,
      datesOfReview: {
        ...currentState.datesOfReview,
        by: option?.value as "year" | "month",
      },
    });
  };

  const setAutoupdateBy = (option: SingleValue<Option>): void => {
    setCurrentState({
      ...currentState,
      autoupdate: Number(option?.value),
    });
  };

  return (
    <div className={styles.settings}>
      <form className={styles.form}>
        <Input
          noErrorHandling={true}
          visualType="narrow"
          placeholder="Введите название отчета"
          hasError={!currentState.title}
          value={currentState.title}
          onChange={(e) =>
            setCurrentState({
              ...currentState,
              title: e.target.value,
            })
          }
        />
        <Select
          options={getMarketOptions()}
          placeholder="Укажите рынок"
          selectedOption={getSelected(currentState?.market as string)}
          setSelectedOption={setSelectedMarket}
        />
        <Select
          options={getNicheOptions()}
          placeholder="Укажите нишу (опционально)"
          selectedOption={getSelected(currentState?.marketNiche as string)}
          setSelectedOption={setSelectedNiche}
        />
      </form>
      <div className={styles.dates}>
        <Checkbox
          label="Указать период отчетности для таблиц"
          checked={currentState.splitByDates}
          onChange={() =>
            setCurrentState({
              ...currentState,
              splitByDates: !currentState.splitByDates,
            })
          }
        />
        {currentState.splitByDates && (
          <div className={styles.datePicker}>
            <Select
              options={periodOptions}
              placeholder=""
              selectedOption={getSelectedPeriodBy(
                currentState?.datesOfReview.by,
              )}
              setSelectedOption={setSelectedPeriodBy}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={["DatePicker", "DatePicker"]}
                sx={{
                  height: "auto",
                  overflowY: "hidden",
                  width: "100%",
                }}
              >
                <DatePicker
                  label={"от"}
                  openTo={currentState.datesOfReview.by}
                  views={
                    currentState.datesOfReview.by === "year"
                      ? ["year"]
                      : ["year", "month"]
                  }
                  value={currentState.datesOfReview.from}
                  onError={(err) => setDateFromError(!!err)}
                  onChange={(newValue) =>
                    setCurrentState({
                      ...currentState,
                      datesOfReview: {
                        ...currentState.datesOfReview,
                        from: newValue as Dayjs,
                      },
                    })
                  }
                  sx={{
                    width: "100%",
                    "& .MuiInputLabel-root": { zIndex: "0" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#52586" },
                    "& .MuiOutlinedInput-root": {
                      "&:hover > fieldset": { borderColor: "#0E3C81" },
                      height: "40px",
                      borderRadius: "30px",
                    },
                  }}
                />
                <DatePicker
                  label={"до"}
                  openTo={currentState.datesOfReview.by}
                  views={
                    currentState.datesOfReview.by === "year"
                      ? ["year"]
                      : ["year", "month"]
                  }
                  value={currentState.datesOfReview.to}
                  maxDate={dayjs(new Date())}
                  onError={(err) => setDateToError(!!err)}
                  onChange={(newValue) =>
                    setCurrentState({
                      ...currentState,
                      datesOfReview: {
                        ...currentState.datesOfReview,
                        to: newValue as Dayjs,
                      },
                    })
                  }
                  sx={{
                    width: "100%",
                    "& .MuiInputLabel-root": { zIndex: "0" },
                    "& .MuiFormControl-root": { minWidth: "100px" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#52586" },
                    "& .MuiOutlinedInput-root": {
                      "&:hover > fieldset": { borderColor: "#0E3C81" },
                      height: "40px",
                      borderRadius: "30px",
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        )}
      </div>
      <div className={styles.autoUpdate}>
        <Checkbox
          label="Автоматически обновлять отчет"
          checked={!!currentState.autoupdate}
          onChange={() =>
            setCurrentState({
              ...currentState,
              autoupdate: Number(!currentState.autoupdate),
            })
          }
        />
        {currentState.autoupdate ? (
          <Select
            options={autoupdateOptions}
            placeholder=""
            selectedOption={getAutoUpdateBy(String(currentState?.autoupdate))}
            setSelectedOption={setAutoupdateBy}
          />
        ) : null}
      </div>
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
                    marketReportRequest={currentState}
                    setMarketReportRequest={setCurrentState}
                  />
                </li>
              ) : (
                <li key={block.id}>
                  <BlockForm
                    setEditStatus={setEditStatus}
                    setKeyToEdit={setKeyToEdit}
                    initialBlock={block}
                    marketReportRequest={currentState}
                    setMarketReportRequest={setCurrentState}
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
                    marketReportRequest={currentState}
                    setMarketReportRequest={setCurrentState}
                  />
                </li>
              ) : (
                <li key={block.id}>
                  <BlockForm
                    setEditStatus={setEditStatus}
                    setKeyToEdit={setKeyToEdit}
                    initialBlock={block}
                    marketReportRequest={currentState}
                    setMarketReportRequest={setCurrentState}
                  />
                </li>
              ),
            )}
        </ul>
        {editStatus === "adding" && (
          <BlockForm
            setEditStatus={setEditStatus}
            setKeyToEdit={setKeyToEdit}
            marketReportRequest={currentState}
            setMarketReportRequest={setCurrentState}
          />
        )}
        {!editStatus && addButton()}
      </Accordion>
    </div>
  );
};

export default MarketReportSettings;
