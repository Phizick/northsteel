import { MarketReport } from "../../api/models/MarketReport.ts";

export interface ITemplate {
  title: string;
  body: MarketReport;
}

const Template = () => {
  return <div></div>;
};

export default Template;
