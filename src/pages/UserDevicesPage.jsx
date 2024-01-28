import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffectAsync } from "../reactHelper";
import useSettingsStyles from "../settings/common/useSettingsStyles";

import { useTranslation } from "../common/components/LocalizationProvider";
import {
  Typography,
  Grid,
  Stack,
  Tooltip,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  IconButton,
  Box,
  Button,
  Modal,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid"; //, GridValueGetterParams,GridColDef
import WifiIcon from "@mui/icons-material/Wifi";
import TableShimmer from "../common/components/TableShimmer";
import SearchHeader, {
  filterByKeyword,
} from "../settings/components/SearchHeader";
import MainCard from "../common/components/mantis/MainCard";
import AnimateButton from "../common/components/mantis/@extended/AnimateButton";
import { formatTime } from "../common/util/formatter";
import { usePreference } from "../common/util/preferences";
import CollectionActions from "../settings/components/CollectionActions";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Table as AntTable } from "antd";
import LinkDevice from "../common/components/LinkDevice";

const UserDevicesPage = () => {
  const classes = useSettingsStyles();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();
  const t = useTranslation();
  const [timestamp, setTimestamp] = useState(Date.now());
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState([]);
  const [devices, setDevices] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [items, setItems] = useState([]);
  const hours12 = usePreference("twelveHourFormat");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  //   const devicesState = useSelector((state) => state.devices.items);
  //   const devices = Object.values(devicesState);

  useEffectAsync(async () => {
    setLoading(true);

    try {
      const userResponse = await fetch("/api/users/" + userId);

      if (userResponse.ok) {
        setUser(await userResponse.json());

        const deviceResponse = await fetch("/api/devices?userId=" + userId);
        if (deviceResponse.ok) {
          setDevices(await deviceResponse.json());
        }
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <React.Fragment>
      <Grid item container spacing={3}>
        <Grid item xs={12} lg={12}>
          <Stack spacing={3}>
            <MainCard>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <Grid item xs={12}>
                    <Stack
                      direction="row"
                      // justifyContent="space-between"
                      alignItems="center"
                      spacing={0}
                    >
                      <Grid item xs={1}>
                        {t("sharedName")}
                      </Grid>
                      <Grid>: {user.name}</Grid>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack
                      direction="row"
                      // justifyContent="space-between"
                      // alignItems="center"
                      spacing={0}
                    >
                      <Grid item xs={1}>
                        {t("userEmail")}
                      </Grid>
                      <Grid>: {user.email}</Grid>
                    </Stack>
                  </Grid>
                </Stack>
              </Grid>
            </MainCard>
            <MainCard
              title={t("sharedDevice")}
              secondary={
                <AnimateButton>
                  <Button
                    onClick={handleClickOpen}
                    disableElevation
                    fullWidth
                    size="small"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {t("sharedNew")}
                  </Button>
                </AnimateButton>
              }
            >
              <SearchHeader
                keyword={searchKeyword}
                setKeyword={setSearchKeyword}
              />
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("sharedName")}</TableCell>
                    <TableCell>{t("deviceIdentifier")}</TableCell>
                    <TableCell>{t("groupParent")}</TableCell>
                    <TableCell>{t("sharedPhone")}</TableCell>
                    <TableCell>{t("deviceModel")}</TableCell>
                    <TableCell>{t("deviceContact")}</TableCell>
                    <TableCell>{t("userExpirationTime")}</TableCell>
                    <TableCell>{t("deviceStatus")}</TableCell>
                    <TableCell className={classes.columnAction} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!loading ? (
                    // filter(filterByKeyword(searchKeyword))
                    devices.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.uniqueId}</TableCell>
                        <TableCell>
                          {item.groupId ? groups[item.groupId]?.name : null}
                        </TableCell>
                        <TableCell>{item.phone}</TableCell>
                        <TableCell>{item.model}</TableCell>
                        <TableCell>{item.contact}</TableCell>
                        <TableCell>
                          {formatTime(item.expirationTime, "date", hours12)}
                        </TableCell>
                        <TableCell>
                          {item.status == "online" ? (
                            <WifiIcon color="success" fontSize="small" />
                          ) : (
                            <WifiIcon color="secondary" fontSize="small" />
                          )}
                        </TableCell>
                        <TableCell
                          className={classes.columnAction}
                          padding="none"
                        >
                          <CollectionActions
                            itemId={item.id}
                            //   editPath="/device"
                            endpoint="devices"
                            setTimestamp={setTimestamp}
                            //   customActions={[actionCommands, actionForwards]}
                            //   readonly={deviceReadonly}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableShimmer columns={7} endAction />
                  )}
                </TableBody>
              </Table>
              {/* <CollectionFab editPath="/device" /> */}
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
      <>
        <Dialog
          fullWidth={true}
          maxWidth={"lg"}
          open={open}
          onClose={handleClose}
          // PaperProps={{
          //   component: 'form',
          //   onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          //     event.preventDefault();
          //     const formData = new FormData(event.currentTarget);
          //     const formJson = Object.fromEntries((formData as any).entries());
          //     const email = formJson.email;
          //     console.log(email);
          //     handleClose();
          //   },
          // }}
        >
          <DialogTitle>{t("sharedDevice")}</DialogTitle>
          <DialogContent>
            <></>
            <LinkDevice
              endpointAll="/api/devices?all=true"
              endpointLinked={`/api/devices?userId=${userId}`}
              baseId={userId}
              keyBase="userId"
              keyLink="deviceId"
              //   label={t("deviceTitle")}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t("closeTitle")}</Button>
          </DialogActions>
        </Dialog>
        {/* <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <LinkDevice
              endpointAll="/api/devices?all=true"
              endpointLinked={`/api/devices?userId=${userId}`}
              baseId={userId}
              keyBase="userId"
              keyLink="deviceId"
              label={t("deviceTitle")}
            />
          </Box>
        </Modal> */}
      </>
    </React.Fragment>
  );
};

export default UserDevicesPage;
