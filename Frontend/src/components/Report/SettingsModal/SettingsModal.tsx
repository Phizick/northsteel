import { MarketReportRequest } from "../../../api/models/MarketReport.ts";
import { Dispatch, SetStateAction, useState } from "react";

interface SettingsModalProps {
  settings: MarketReportRequest;
  setSettings: Dispatch<SetStateAction<MarketReportRequest>>;
}

const SettingsModal = ({ settings, setSettings }: SettingsModalProps) => {
  const [dateFromError, setDateFromError] = useState<boolean>(false);
  const [dateToError, setDateToError] = useState<boolean>(false);

  return <div></div>;
};

export default SettingsModal;
