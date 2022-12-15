import DashboardIcon from "@mui/icons-material/Dashboard";
import ImageIcon from "@mui/icons-material/Image";
import PublicIcon from "@mui/icons-material/Public";
import SecurityIcon from "@mui/icons-material/Security";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";

export const items = [
  {
    name: "dashboard",
    to: "/",
    exact: true,
    icon: <DashboardIcon titleAccess="dashboard" />,
  },
  {
    name: "contacts",
    to: "/contacts",
    exact: true,
    icon: <PermContactCalendarIcon titleAccess="contacts" />,
  },
  {
    name: "images",
    to: "/images",
    exact: true,
    icon: <ImageIcon titleAccess="images" />,
    subItems: [
      {
        name: "Public Images",
        to: "/public-images",
        exact: true,
        icon: <PublicIcon titleAccess="public images" />,
      },
      {
        name: "Private Images",
        to: "/private-images",
        exact: true,
        icon: <SecurityIcon titleAccess="private images" />,
      },
    ],
  },
];
