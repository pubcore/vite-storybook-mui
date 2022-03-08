import axios from "axios";
import XLSX from "xlsx";

const getWorkbook = async (fileName: string) => {
  const response = await axios.get(fileName, {
    responseType: "arraybuffer",
  });
  return XLSX.read(response.data);
};

export const fileName = "/publicTestData.xlsx";
export const fileName2 = "/publicTestDataManyPages.xlsx";
export const workbook = await getWorkbook(fileName);
export const workbook2 = await getWorkbook(fileName2);

export const targetColumnsBasic = [
  { id: "OID", name: "Order ID" },
  { id: "PID", name: "Product ID" },
  { id: "OD", name: "Date of order" },
];
export const targetColumns = [
  ...targetColumnsBasic,
  { id: "PRIO_1_DETAILS" },
  { id: "INCOMMING_DATE", name: "Date of creation" },
  { id: "Cty", name: "City, Village or Town" },
  { id: "PC", name: "Postal code" },
  { id: "ADDRESS1", name: "Street" },
  { id: "ADDRESS2", name: "Additional address data" },
  { id: "FIRST_NAME", name: "First Name" },
  { id: "LAST_NAME", name: "Last Name" },
  { id: "BIRTHDAY", name: "Birthday" },
  { id: "EMAIL", name: "Email address" },
  { id: "HOME_PAGE", name: "URI of home page" },
  { id: "ORDER_TOTAL", name: "ORDER_TOTAL" },
  { id: "TAX", name: "Tax total" },
  { id: "DELIVERY_ADDRESS", name: "Delivery Address" },
];
