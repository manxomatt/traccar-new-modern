// project import
import pages from "./pages";
import dashboard from "./dashboard";
import MenuAdmin from "./MenuAdmin";
import MenuUser from "./MenuUser";
import menu from "../store/reducers/menu";
// import utilities from './utilities';
// import support from './support';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [MenuAdmin], //, pages], //, utilities, support]
};

const adminMenuItems = {
  items: [MenuAdmin],
};

const userMenuItems = {
  items: [MenuUser],
};

export default menuItems;
export { adminMenuItems, userMenuItems };
