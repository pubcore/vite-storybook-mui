import DashboardIcon from "@mui/icons-material/Dashboard";
import ImageIcon from "@mui/icons-material/Image";

export const items = [
  {
    name: "dashboard",
    to: "/",
    exact: true,
    icon: <DashboardIcon titleAccess="dashboard" />,
  },
  {
    name: "images",
    to: "/images",
    exact: true,
    icon: <ImageIcon titleAccess="images" />,
  },
];
