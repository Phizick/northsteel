import styles from "./StepOneForms.module.scss";
import Input from "../../../../../shared/Input/Input.tsx";
import Select from "../../../../../shared/Select/Select.tsx";
import Checkbox from "../../../../../shared/Checkbox/Checkbox.tsx";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";
import {
  autoupdateOptions,
  thematics,
} from "../../../../../utils/variables.ts";
import { Dispatch, SetStateAction } from "react";
import { useStores } from "../../../../../stores/root-store-context.ts";
import { Thematic } from "../../../../../api/models/User.ts";
import { Option } from "../../../../../shared/MultiSelect/MultiSelect.tsx";
import { SingleValue } from "react-select";
import { MarketReportRequest } from "../../../../../api/models/MarketReport.ts";

export const periodOptions: Option[] = [
  {
    label: "По годам",
    value: "year",
  },
  {
    label: "По месяцам",
    value: "month",
  },
];

interface StepForms {
  setDateFromError: Dispatch<SetStateAction<boolean>>;
  setDateToError: Dispatch<SetStateAction<boolean>>;
  reportRequest: MarketReportRequest;
  setReportRequest: (request: MarketReportRequest) => void;
}

const StepOneForms = ({
  setDateFromError,
  setDateToError,
  setReportRequest: setMarketReportRequest,
  reportRequest: marketReportRequest,
}: StepForms) => {
  const { userStore } = useStores();

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
    if (marketReportRequest.market) {
      const market: Thematic = thematics.find(
        (market) => market.value === marketReportRequest.market,
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
    setMarketReportRequest({
      ...marketReportRequest,
      market: option?.value || "",
      marketNiche: "",
    });
  };

  const setSelectedNiche = (option: SingleValue<Option>): void => {
    setMarketReportRequest({
      ...marketReportRequest,
      marketNiche: option?.value || "",
    });
  };

  const setSelectedPeriodBy = (option: SingleValue<Option>): void => {
    setMarketReportRequest({
      ...marketReportRequest,
      datesOfReview: {
        ...marketReportRequest.datesOfReview,
        by: option?.value as "year" | "month",
      },
    });
  };

  const setAutoupdateBy = (option: SingleValue<Option>): void => {
    setMarketReportRequest({
      ...marketReportRequest,
      autoupdate: Number(option?.value),
    });
  };

  return (
    <div className={styles.forms}>
      <p className={styles.title}>Информация об отчете</p>
      <form className={styles.form}>
        <Input
          noErrorHandling={true}
          visualType="narrow"
          placeholder="Введите название отчета"
          hasError={!marketReportRequest.title}
          value={marketReportRequest.title}
          onChange={(e) =>
            setMarketReportRequest({
              ...marketReportRequest,
              title: e.target.value,
            })
          }
        />
        <Select
          options={getMarketOptions()}
          placeholder="Укажите рынок"
          selectedOption={getSelected(marketReportRequest?.market as string)}
          setSelectedOption={setSelectedMarket}
        />
        <Select
          options={getNicheOptions()}
          placeholder="Укажите нишу (опционально)"
          selectedOption={getSelected(
            marketReportRequest?.marketNiche as string,
          )}
          setSelectedOption={setSelectedNiche}
        />
      </form>
      <div className={styles.dates}>
        <Checkbox
          label="Указать период отчетности для таблиц"
          checked={marketReportRequest.splitByDates}
          onChange={() =>
            setMarketReportRequest({
              ...marketReportRequest,
              splitByDates: !marketReportRequest.splitByDates,
            })
          }
        />
        {marketReportRequest.splitByDates && (
          <div className={styles.datePicker}>
            <Select
              options={periodOptions}
              placeholder=""
              selectedOption={getSelectedPeriodBy(
                marketReportRequest?.datesOfReview.by,
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
                  openTo={marketReportRequest.datesOfReview.by}
                  views={
                    marketReportRequest.datesOfReview.by === "year"
                      ? ["year"]
                      : ["year", "month"]
                  }
                  maxDate={dayjs(new Date())}
                  value={marketReportRequest.datesOfReview.from}
                  onError={(err) => setDateFromError(!!err)}
                  onChange={(newValue) =>
                    setMarketReportRequest({
                      ...marketReportRequest,
                      datesOfReview: {
                        ...marketReportRequest.datesOfReview,
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
                  openTo={marketReportRequest.datesOfReview.by}
                  views={
                    marketReportRequest.datesOfReview.by === "year"
                      ? ["year"]
                      : ["year", "month"]
                  }
                  value={marketReportRequest.datesOfReview.to}
                  maxDate={dayjs(new Date())}
                  onError={(err) => setDateToError(!!err)}
                  onChange={(newValue) =>
                    setMarketReportRequest({
                      ...marketReportRequest,
                      datesOfReview: {
                        ...marketReportRequest.datesOfReview,
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
          checked={!!marketReportRequest.autoupdate}
          onChange={() =>
            setMarketReportRequest({
              ...marketReportRequest,
              autoupdate: Number(!marketReportRequest.autoupdate),
            })
          }
        />
        {marketReportRequest.autoupdate ? (
          <Select
            options={autoupdateOptions}
            placeholder=""
            selectedOption={getAutoUpdateBy(
              String(marketReportRequest?.autoupdate),
            )}
            setSelectedOption={setAutoupdateBy}
          />
        ) : null}
      </div>
    </div>
  );
};

export default StepOneForms;
