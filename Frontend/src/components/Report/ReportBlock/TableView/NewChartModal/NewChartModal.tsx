import { TableResponse } from "../../../../../api/models/MarketReport.ts";
import { ChartOptions } from "../ReportChart/types";
import { Dispatch, SetStateAction } from "react";
import NewChartDatesModal from "./NewChartDatesModal/NewChartDatesModal.tsx";
import NewChartFlatModal from "./NewChartFlatModal/NewChartFlatModal.tsx";

interface NewChartModalProps {
  block: TableResponse;
  options: ChartOptions;
  setOptions: Dispatch<SetStateAction<ChartOptions>>;
  type: "dates" | "flat";
}

const NewChartModal = ({
  block,
  options,
  setOptions,
  type,
}: NewChartModalProps) => {
  if (type === "dates") {
    return (
      <NewChartDatesModal
        block={block}
        options={options}
        setOptions={setOptions}
      />
    );
  }

  if (type === "flat") {
    return (
      <NewChartFlatModal
        block={block}
        options={options}
        setOptions={setOptions}
      />
    );
  }
};

export default NewChartModal;
