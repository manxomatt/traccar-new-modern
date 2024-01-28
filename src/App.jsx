import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import BottomMenu from "./common/components/BottomMenu";
import SocketController from "./SocketController";
import CachingController from "./CachingController";
import { useEffectAsync } from "./reactHelper";
import { sessionActions } from "./store";
import UpdateController from "./UpdateController";
import MainLayout from "./layout/MainLayout";

const useStyles = makeStyles(() => ({
  page: {
    flexGrow: 1,
    overflow: "auto",
  },
  menu: {
    zIndex: 4,
  },
}));

const App = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const newServer = useSelector((state) => state.session.server.newServer);
  const initialized = useSelector((state) => !!state.session.user);

  useEffectAsync(async () => {
    if (!initialized) {
      const response = await fetch("/api/session");
      if (response.ok) {
        dispatch(sessionActions.updateUser(await response.json()));
      } else if (newServer) {
        navigate("/register");
      } else {
        navigate("/login");
      }
    }
    return null;
  }, [initialized]);

  return !initialized ? (
    <LinearProgress />
  ) : (
    <>
      <SocketController />
      <CachingController />
      <UpdateController />
      <MainLayout>
        <div className={classes.page}>
          <Outlet />
        </div>
        {!desktop && (
          <div className={classes.menu}>
            <BottomMenu />
          </div>
        )}
      </MainLayout>
    </>
  );
};

export default App;
