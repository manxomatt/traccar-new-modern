import { Box, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Drawer from "./Drawer";
import Header from "./Header";
import navigation from "../../menu-items";
import Breadcrumbs from "../../common/components/mantis/@extended/Breadcrumbs";
import { openDrawer } from "../../store/reducers/menu";

const MainLayout = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down("lg"));
  const dispatch = useDispatch();

  const { drawerOpen } = useSelector((state) => state.reducers.menu);

  // // drawer toggler
  const [open, setOpen] = useState(drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };

  useEffect(() => {
    setOpen(!matchDownLG);
    dispatch(openDrawer({ drawerOpen: !matchDownLG }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Header open={open} handleDrawerToggle={handleDrawerToggle} />
      <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{ width: "100%", flexGrow: 1, p: { xs: 2, sm: 3 } }}
      >
        <Toolbar />
        <Breadcrumbs navigation={navigation} title />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
