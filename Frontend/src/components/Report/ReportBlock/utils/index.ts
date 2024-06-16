import {
  TableResponse,
  TextResponse,
} from "../../../../api/models/MarketReport.ts";

export const isDataInvalid = (block: TableResponse | TextResponse) => {
  if (!Array.isArray(block.data)) {
    return true;
  }

  if (!block.data.length) {
    return true;
  }

  if (
    block.data.some(
      (item) =>
        typeof item !== "object" ||
        Object.values(item).some((value) => typeof value === "object"),
    )
  ) {
    return true;
  }

  return false;
};
