import axios from "axios";
import XLSX from "xlsx";

const getWorkbook = async (fileName: string) => {
  const response = await axios.get(fileName, {
    responseType: "arraybuffer",
  });
  return XLSX.read(response.data);
};

export const fileName = "/publicTestData.xlsx";
export const workbook = await getWorkbook(fileName);
export const workbook2 = await getWorkbook(fileName);

export const targetColumns = [
  { id: "ORDER_ID", name: "Order ID" },
  { id: "PRODUCT_ID", name: "Product ID" },
  { id: "DATE", name: "Date of order" },
  { id: "INCOMMING_DATE", name: "Date of creation" },
  { id: "CITY", name: "City, Village or Town" },
  { id: "ZIP", name: "Postal code" },
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
  { id: "PRIO_1_DETAIL" },
];
