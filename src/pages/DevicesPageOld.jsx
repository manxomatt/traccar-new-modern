import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Button,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

import WifiIcon from "@mui/icons-material/Wifi";
import Forward10Icon from "@mui/icons-material/Forward10";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";
import { useEffectAsync } from "../reactHelper";
import { useTranslation } from "../common/components/LocalizationProvider";
import PageLayout from "../common/components/PageLayout";
import SettingsMenu from "../settings/components/SettingsMenu";
import CollectionFab from "../settings/components/CollectionFab";
import CollectionActions from "../settings/components/CollectionActions";
import TableShimmer from "../common/components/TableShimmer";
import SearchHeader, {
  filterByKeyword,
} from "../settings/components/SearchHeader";
import { usePreference } from "../common/util/preferences";
import { formatTime } from "../common/util/formatter";
import { useDeviceReadonly } from "../common/util/permissions";
import useSettingsStyles from "../settings/common/useSettingsStyles";
import MainCard from "../common/components/mantis/MainCard";
import { devicesActions } from "../store";
import AnimateButton from "../common/components/mantis/@extended/AnimateButton";

const DevicesPageOld = () => {
  const classes = useSettingsStyles();
  const navigate = useNavigate();
  const t = useTranslation();
  const dispatch = useDispatch();

  const groups = useSelector((state) => state.groups.items);

  const devicesState = useSelector((state) => state.devices.items);
  const devices = Object.values(devicesState);

  const hours12 = usePreference("twelveHourFormat");

  const deviceReadonly = useDeviceReadonly();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/devices");
      if (response.ok) {
        // setItems(await response.json());
        dispatch(devicesActions.refresh(await response.json()));
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  const actionCommands = {
    key: "command",
    title: t("sendCommandDevice"),
    icon: <VideoSettingsIcon fontSize="small" />,
    handler: (deviceId) => navigate(`/device/${deviceId}/commands`),
  };

  const actionForwards = {
    key: "forward",
    title: t("forwardDevice"),
    icon: <Forward10Icon fontSize="small" />,
    handler: (deviceId) => navigate(`/device/${deviceId}/forwards`),
  };

  return (
    <MainCard
      title={t("sharedDevice")}
      secondary={
        !deviceReadonly && (
          <Link to="/devices/add">
            <AnimateButton>
              <Button
                disabled={deviceReadonly}
                href="/devices/add"
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
          </Link>
        )
      }
    >
      <SearchHeader keyword={searchKeyword} setKeyword={setSearchKeyword} />
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{t("sharedName")}</TableCell>
            <TableCell>{t("deviceImei")}</TableCell>
            {/* <TableCell>{t("groupParent")}</TableCell> */}
            <TableCell>{t("sharedGsmNumber")}</TableCell>
            <TableCell>{t("deviceType")}</TableCell>
            <TableCell>{t("expirationDate")}</TableCell>
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
                {/* <TableCell>
                  {item.groupId ? groups[item.groupId]?.name : null}
                </TableCell> */}
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.model}</TableCell>

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
                <TableCell className={classes.columnAction} padding="none">
                  <CollectionActions
                    itemId={item.id}
                    editPath="/device"
                    endpoint="devices"
                    setTimestamp={setTimestamp}
                    customActions={[actionCommands, actionForwards]}
                    readonly={deviceReadonly}
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
  );
};

export default DevicesPageOld;
