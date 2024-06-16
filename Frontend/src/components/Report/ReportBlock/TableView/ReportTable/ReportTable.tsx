import styles from "./ReportTable.module.scss";
import { TableResponse } from "../../../../../api/models/MarketReport.ts";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_ExpandAllButton,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Stack } from "@mui/material";
import { useMemo } from "react";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import ButtonSimple from "../../../../../shared/ButtonSimple/ButtonSimple.tsx";
import * as XLSX from "xlsx";

interface ReportTableProps {
  block: TableResponse;
}

const ReportTable = ({ block }: ReportTableProps) => {
  const columns = useMemo<MRT_ColumnDef<typeof block.data>[]>(
    //column definitions...
    () => {
      const keys = block.columnsKeysOrder
        ? block.columnsKeysOrder
        : Object.keys(block.data[0]);

      return keys.map((key) => ({
        header: key,
        accessorKey: key,
      }));
    },
    [],
    //end
  );

  const initialGrouping = Object.keys(block.data[0]).some(
    (key) => key === "Показатель",
  )
    ? [Object.keys(block.data[0])[0]]
    : [];

  const download = () => {
    const workSheet = XLSX.utils.json_to_sheet(block.data);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet);

    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });

    XLSX.writeFile(workBook, `${block.title}.xlsx`);
  };

  const table = useMaterialReactTable({
    columns,
    // @ts-ignore
    data: block.data,
    displayColumnDefOptions: {
      "mrt-row-expand": {
        Header: () => (
          <Stack direction="row" alignItems="center">
            <MRT_ExpandAllButton table={table} />
            <Box>Groups</Box>
          </Stack>
        ),
        GroupedCell: ({ row, table }) => {
          const { grouping } = table.getState();
          return row.getValue(grouping[grouping.length - 1]);
        },
        enableResizing: true,
        muiTableBodyCellProps: ({ row }) => ({
          sx: (theme) => ({
            color:
              row.depth === 0
                ? theme.palette.primary.main
                : row.depth === 1
                  ? theme.palette.secondary.main
                  : undefined,
          }),
        }),
        size: 200,
      },
    },
    muiTableContainerProps: {
      sx: {
        maxWidth: "100%",
        dataHtml2canvasIgnore: "true",
      },
    },
    enableGrouping: true,
    enableColumnResizing: true,
    enablePagination: false,
    groupedColumnMode: "remove",
    initialState: {
      density: "compact",
      expanded: true,
      grouping: initialGrouping,
      pagination: { pageIndex: 0, pageSize: 20 },
      sorting: [],
    },
    localization: { ...MRT_Localization_RU, groupedBy: "Сгруппировано по " },
    renderBottomToolbarCustomActions: ({}) => (
      <Box>
        <ButtonSimple
          onClick={download}
          data-html2canvas-ignore="true"
          className={styles.button}
        >
          Экспортировать в XLSX
        </ButtonSimple>
      </Box>
    ),
  });

  return (
    <div className={styles.view}>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default ReportTable;
