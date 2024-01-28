// assets
import {
  DashboardOutlined,
  UserOutlined,
  MobileOutlined,
  CarOutlined,
} from "@ant-design/icons";
import LinkIcon from "@mui/icons-material/Link";
import { useAdministrator } from "../common/util/permissions";
// icons
const icons = {
  DashboardOutlined,
  UserOutlined,
  MobileOutlined,
  CarOutlined,
};
// const admin = useAdministrator();
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: "group-dashboard",
  title: "Navigation",
  type: "group",
  children: [
    {
      id: "user",
      title: "Users",
      type: "item",
      url: "/users",
      icon: icons.UserOutlined,
      breadcrumbs: true,
    },
    // {
    //   id: "device",
    //   title: "Devices",
    //   type: "item",
    //   url: "/devices",
    //   icon: icons.CarOutlined,
    //   breadcrumbs: true,
    // },
    {
      id: "supportedDevice",
      title: "Supported Devices",
      type: "item",
      url: "/devices/supported",
      icon: icons.CarOutlined,
      breadcrumbs: true,
    },
  ],
};

export default dashboard;
