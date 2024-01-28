// material-ui
import { Box, Typography } from "@mui/material";

// project import
import NavGroup from "./NavGroup";
import { adminMenuItems, userMenuItems } from "../../../../../menu-items";

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

import { useAdministrator } from "../../../../../common/util/permissions";
const Navigation = () => {
  const admin = useAdministrator();
  let navGroups;
  if (admin) {
    navGroups = adminMenuItems.items.map((item) => {
      switch (item.type) {
        case "group":
          return <NavGroup key={item.id} item={item} />;
        default:
          return (
            <Typography key={item.id} variant="h6" color="error" align="center">
              Fix - Navigation Group
            </Typography>
          );
      }
    });
  } else {
    navGroups = userMenuItems.items.map((item) => {
      switch (item.type) {
        case "group":
          return <NavGroup key={item.id} item={item} />;
        default:
          return (
            <Typography key={item.id} variant="h6" color="error" align="center">
              Fix - Navigation Group
            </Typography>
          );
      }
    });
  }

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
