import axios from "axios";
import { read } from "xlsx";

const getWorkbook = async (fileName: string) => {
  const response = await axios.get(fileName, {
    responseType: "arraybuffer",
  });
  return read(response.data);
};

export const fileName = "/publicTestData.xlsx";
export const fileName2 = "/publicTestDataManyPages.xlsx";
export const fileName3 = "/publicTestData_small.xlsx";
export const fileName4 = "/publicTestDataManyPages_small.xlsx";
export const fileName5 = "/publicTestData_small_onlyOneKeyColumn.xlsx";
export const workbook = await getWorkbook(fileName);
export const workbook2 = await getWorkbook(fileName2);
export const workbook3 = await getWorkbook(fileName3);
export const workbook4 = await getWorkbook(fileName4);
export const workbook5 = await getWorkbook(fileName5);
