// @ts-nocheck
/// <reference types="vite-plugin-svgr/client" />
import styles from "./Example.module.scss";
import { useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "../../shared/Button/Button.tsx";
import Input from "../../shared/Input/Input.tsx";
import ButtonIcon from "../../shared/ButtonIcon/ButtonIcon.tsx";
import { ButtonIconTypes } from "../../shared/ButtonIcon/types";
import Plus from "../../assets/images/icons/plus-white.svg?react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { usePDF } from "react-to-pdf";
import { MRT_Localization_RU } from "material-react-table/locales/ru";

const Example = () => {
  const [columns, setColumns] = useState<MRT_ColumnDef<any>[]>([]);
  const [rows, setRows] = useState<any>([]);
  const [createColumn, setCreateColumn] = useState(false);
  const [newColumnValue, setNewColumnValue] = useState<string>("");

  console.log(newColumnValue);

  console.log("Колонки: ", columns);
  console.log("Строки: ", rows);

  const handleAddRow = () => {
    const newRow: { [key: string]: string | null } = {};
    columns.forEach((column) => {
      newRow[column.header] = null;
    });

    setRows([...rows, newRow]);
  };

  const handleAddColumn = () => {
    const newColumn = {
      accessorKey: newColumnValue,
      header: newColumnValue,
      muiEditTextFieldProps: ({ cell, table }) => ({
        type: "text",
        required: true,
        onChange: (event) => {
          const rowsModel = table.getCenterRows();
          const cells = rowsModel[0].getAllCells();
          console.log(cells[0]);
          const rows = rowsModel.map((row) => {
            const cells = row.getAllCells();
            const curRow = {};
            cells.forEach((c) => {
              curRow[c.id.split("_").at(-1)] = c.getValue();
            });
            return curRow;
          });
          const curRow = rows[cell.row.index];
          curRow[cell.column.id] = event.target.value;
          setRows([...rows]);
        },
      }),
    };

    rows.map((row) => {
      row[newColumnValue] = "";
      return { ...row };
    });

    setColumns([...columns, newColumn]);
    setRows([...rows]);
    setNewColumnValue("");
  };

  const table = useMaterialReactTable({
    columns,
    data: rows,
    createDisplayMode: "row", // ('modal', and 'custom' are also available)
    editDisplayMode: "table", // ('modal', 'row', 'cell', and 'custom' are also
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    positionCreatingRow: "bottom",
    getRowId: (row) => row.id,
    muiTableContainerProps: {
      sx: {
        height: "500px",
        width: "45svw",
      },
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => {}}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    // renderBottomToolbarCustomActions: () => (
    //   <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
    //     <Button onClick={() => console.log("Сохранение в форму отправки")}>
    //       Сохранить
    //     </Button>
    //   </Box>
    // ),
    // renderTopToolbarCustomActions: ({ table }) => (
    //   <div className={styles.buttonContainer}>
    //     <Button className={styles.button} onClick={handleAddRow}>
    //       <Plus /> Добавить строку
    //     </Button>
    //     {!createColumn ? (
    //       <Button
    //         className={`${styles.button} ${styles.withMargin}`}
    //         onClick={() => setCreateColumn(true)}
    //       >
    //         <Plus /> Добавить колонку
    //       </Button>
    //     ) : (
    //       <Input
    //         value={newColumnValue}
    //         onChange={(e) => setNewColumnValue(e.target.value)}
    //         placeholder="Введите название колонки"
    //       >
    //         <div className={styles.iconContainer}>
    //           <ButtonIcon
    //             icon={ButtonIconTypes.EDIT}
    //             onClick={handleAddColumn}
    //           />
    //           <ButtonIcon
    //             icon={ButtonIconTypes.CANCEL}
    //             onClick={() => {
    //               setNewColumnValue("");
    //               setCreateColumn(false);
    //             }}
    //           />
    //         </div>
    //       </Input>
    //     )}
    //   </div>
    // ),
  });

  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  return (
    <div>
      <button onClick={() => toPDF()}>Download PDF</button>
      <div className={styles.container} ref={targetRef}>
        <MaterialReactTable table={table} />
        <div className={styles.optionsContainer}>
          <div className={styles.buttonContainer}>
            <Button className={styles.button} onClick={handleAddRow}>
              <Plus /> Добавить строку
            </Button>
            {!createColumn ? (
              <Button
                className={`${styles.button} ${styles.withMargin}`}
                onClick={() => setCreateColumn(true)}
              >
                <Plus /> Добавить колонку
              </Button>
            ) : (
              <Input
                value={newColumnValue}
                onChange={(e) => setNewColumnValue(e.target.value)}
                placeholder="Введите название колонки"
              >
                <div className={styles.iconContainer}>
                  <ButtonIcon
                    icon={ButtonIconTypes.EDIT}
                    onClick={handleAddColumn}
                  />
                  <ButtonIcon
                    icon={ButtonIconTypes.CANCEL}
                    onClick={() => {
                      setNewColumnValue("");
                      setCreateColumn(false);
                    }}
                  />
                </div>
              </Input>
            )}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <h3>Период отчета</h3>
              <DemoContainer components={["DatePicker", "DatePicker"]}>
                <DatePicker label={"от"} openTo="year" views={["year"]} />
                <DatePicker
                  label={"до"}
                  openTo="month"
                  views={["year", "month"]}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <Button onClick={() => console.log("Сохранение в форму отправки")}>
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Example;
