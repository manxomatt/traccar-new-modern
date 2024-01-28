import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import qs from "qs";
import { Button, Stack } from "@mui/material";
import { Table, Space, Tag } from "antd";

import WifiIcon from "@mui/icons-material/Wifi";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";
import { useEffectAsync } from "../reactHelper";
import { useTranslation } from "../common/components/LocalizationProvider";
import CollectionActions from "../settings/components/CollectionActions";
import { usePreference } from "../common/util/preferences";
import { formatTime } from "../common/util/formatter";
import { useDeviceReadonly } from "../common/util/permissions";
import useSettingsStyles from "../settings/common/useSettingsStyles";
import MainCard from "../common/components/mantis/MainCard";
import AnimateButton from "../common/components/mantis/@extended/AnimateButton";
import SearchField from "../common/components/SearcFIeld";
import FastForwardIcon from "@mui/icons-material/FastForward";
import { devicesActions } from "../store";
import dayjs from "dayjs";
import { useAdministrator } from "../common/util/permissions";

const DevicesPage = () => {
  const admin = useAdministrator();
  const [mUserId, setMUserId] = useState();
  const hours12 = usePreference("twelveHourFormat");
  const classes = useSettingsStyles();
  const navigate = useNavigate();
  const t = useTranslation();
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [searchKeyword, setSearchKeyword] = useState("");

  const [open, setOpen] = useState(false);

  const deviceReadonly = useDeviceReadonly();

  const columns = [
    {
      title: t("sharedName"),
      dataIndex: "name",
      sorter: false,
      render: (name) => `${name}`,
      width: "20%",
    },
    {
      title: t("deviceImei"),
      dataIndex: "uniqueId",
    },
    {
      title: t("simcardNumber"),
      dataIndex: "phone",
    },
    {
      title: t("gpsType"),
      dataIndex: "model",
    },
    {
      title: t("deviceLastConnection"),
      dataIndex: "lastUpdate",
      render: (lastUpdate) =>
        `${formatTime(lastUpdate, "date")} ${formatTime(lastUpdate, "time")}`,
    },
    {
      title: t("expirationDate"),
      dataIndex: "expirationTime",
      render: (expirationTime) => `${formatTime(expirationTime, "date")}`,
    },
    {
      title: t("deviceStatus"),
      dataIndex: "status",
      render: (status) =>
        status == "online" ? (
          <WifiIcon color="success" fontSize="small" />
        ) : (
          <WifiIcon color="secondary" fontSize="small" />
        ),
    },
    {
      title: t("settingsUsers"),
      dataIndex: "deviceUsers",
      render: (deviceUsers) =>
        deviceUsers != undefined ? (
          <>
            {deviceUsers.map((user) => (
              <Tag color="blue" key={user.id}>
                {user.name}
              </Tag>
            ))}
          </>
        ) : (
          ""
        ),
    },
    {
      title: "",
      key: "action",
      width: "100px",
      render: (_, record) => (
        <Space size="middle">
          <CollectionActions
            itemId={record.id}
            editPath="/devices/edit"
            endpoint="devices"
            setTimestamp={setTimestamp}
            customActions={[actionCommands, actionForwards]}
          />
        </Space>
      ),
    },
  ];

  if (!admin) {
    columns.splice(7, 1);
  }

  const getParams = (params) => ({
    query: searchKeyword,
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
  });

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffectAsync(async () => {
    setLoading(true);
    try {
      fetch(`/api/v1/devices?${qs.stringify(getParams(tableParams))}`)
        .then((res) => res.json())
        .then(({ info, results }) => {
          //   setData(results);
          dispatch(devicesActions.refresh(results));
          setLoading(false);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: info.totalCount,
            },
          });
        });
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(tableParams), timestamp]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const actionCommands = {
    key: "command",
    title: t("sendCommandDevice"),
    icon: <VideoSettingsIcon fontSize="small" />,
    handler: (deviceId) => navigate(`/device/${deviceId}/commands`),
  };

  const actionForwards = {
    key: "forward",
    title: t("forwardDevice"),
    icon: <FastForwardIcon fontSize="small" />,
    handler: (deviceId) => navigate(`/device/${deviceId}/forwards`),
  };

  const devicesState = useSelector((state) => state.devices.items);
  const devices = Object.values(devicesState);

  return (
    <React.Fragment>
      <MainCard
        title={t("sharedDevice")}
        secondary={
          !deviceReadonly && (
            // <Link to="/devices/add">
            <AnimateButton>
              <Button
                component={Link}
                disabled={deviceReadonly}
                to="/devices/add"
                disableElevation
                fullWidth
                size="small"
                type="submit"
                variant="contained"
                color="primary"
              >
                {t("sharedNewDevice")}
              </Button>
            </AnimateButton>
            // </Link>
          )
        }
      >
        <Stack spacing={1}>
          <SearchField
            xs={6}
            keyword={searchKeyword}
            setKeyword={setSearchKeyword}
            setTimestamp={setTimestamp}
          />
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={devices}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
        </Stack>
      </MainCard>
    </React.Fragment>
  );

  //   <MainCard
  // title={t("sharedDevice")}
  // secondary={
  //   !deviceReadonly && (
  //     <Link to="/devices/add">
  //       <AnimateButton>
  //         <Button
  //           disabled={deviceReadonly}
  //           href="/devices/add"
  //           disableElevation
  //           fullWidth
  //           size="small"
  //           type="submit"
  //           variant="contained"
  //           color="primary"
  //         >
  //           {t("sharedAddDevice")}
  //         </Button>
  //       </AnimateButton>
  //     </Link>
  //   )
  // }
  //   >
  //     <SearchHeader keyword={searchKeyword} setKeyword={setSearchKeyword} />
  //     <Table className={classes.table}>
  //       <TableHead>
  //         <TableRow>
  //           <TableCell>{t("sharedName")}</TableCell>
  //           <TableCell>{t("deviceImei")}</TableCell>
  //           {/* <TableCell>{t("groupParent")}</TableCell> */}
  //           <TableCell>{t("sharedGsmNumber")}</TableCell>
  //           <TableCell>{t("deviceType")}</TableCell>
  //           <TableCell>{t("expirationDate")}</TableCell>
  //           <TableCell>{t("deviceStatus")}</TableCell>
  //           <TableCell className={classes.columnAction} />
  //         </TableRow>
  //       </TableHead>
  //       <TableBody>
  //         {!loading ? (
  //           // filter(filterByKeyword(searchKeyword))
  //           devices.map((item) => (
  //             <TableRow key={item.id}>
  //               <TableCell>{item.name}</TableCell>
  //               <TableCell>{item.uniqueId}</TableCell>
  //               {/* <TableCell>
  //                 {item.groupId ? groups[item.groupId]?.name : null}
  //               </TableCell> */}
  //               <TableCell>{item.phone}</TableCell>
  //               <TableCell>{item.model}</TableCell>

  //               <TableCell>
  //                 {formatTime(item.expirationTime, "date", hours12)}
  //               </TableCell>
  //               <TableCell>
  // {item.status == "online" ? (
  //   <WifiIcon color="success" fontSize="small" />
  // ) : (
  //   <WifiIcon color="secondary" fontSize="small" />
  // )}
  //               </TableCell>
  //               <TableCell className={classes.columnAction} padding="none">
  //                 <CollectionActions
  //                   itemId={item.id}
  //                   editPath="/device"
  //                   endpoint="devices"
  //                   setTimestamp={setTimestamp}
  //                   customActions={[actionCommands, actionForwards]}
  //                   readonly={deviceReadonly}
  //                 />
  //               </TableCell>
  //             </TableRow>
  //           ))
  //         ) : (
  //           <TableShimmer columns={7} endAction />
  //         )}
  //       </TableBody>
  //     </Table>
  //     {/* <CollectionFab editPath="/device" /> */}
  //   </MainCard>
  // );
};

export default DevicesPage;
