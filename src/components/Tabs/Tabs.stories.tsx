import { TabPanel } from "../";
import { Tab, Tabs } from "@mui/material";

export default {
  title: "Tabs",
};

export const Default = () => (
  <>
    <TabPanel tab="a">
      <Tabs aria-label="basic tabs example">
        <Tab label="Item One" />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
      </Tabs>
    </TabPanel>
  </>
);
