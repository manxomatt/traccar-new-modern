// assets
import {
  DashboardOutlined,
  UserOutlined,
  MobileOutlined,
  CarOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import LinkIcon from "@mui/icons-material/Link";

// icons
const icons = {
  DashboardOutlined,
  UserOutlined,
  MobileOutlined,
  CarOutlined,
  ProfileOutlined,
};
// const admin = useAdministrator();
// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const MenuAdmin = {
  id: "group-admin",
  title: "Navigation",
  type: "group",
  children: [
    {
      id: "device",
      title: "Devices",
      type: "item",
      url: "/devices",
      icon: icons.CarOutlined,
      breadcrumbs: true,
    },
    {
      id: "supportedDevice",
      title: "Supported Devices",
      type: "item",
      url: "/devices/supported",
      icon: icons.ProfileOutlined,
      breadcrumbs: true,
    },
  ],
};

export default MenuAdmin;
