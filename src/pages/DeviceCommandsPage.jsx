import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffectAsync } from "../reactHelper";
import qs from "qs";
import {
  Grid,
  Stack,
  Button,
  CircularProgress,
  Typography,
  // Space,
} from "@mui/material";

import { Table, Space } from "antd"; //,
import CheckIcon from "@mui/icons-material/Check";
import CollectionActions from "../settings/components/CollectionActions";

import MainCard from "../common/components/mantis/MainCard";
import { useTranslation } from "../common/components/LocalizationProvider";

// import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";

import { commandsActions } from "../store";
import AnimateButton from "../common/components/mantis/@extended/AnimateButton";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { formatTime } from "../common/util/formatter";
import SendIcon from "@mui/icons-material/Send";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { prefixString } from "../common/util/stringUtils";

const DeviceCommandsPage = () => {
  const { id } = useParams();
  const t = useTranslation();
  const dispatch = useDispatch();

  const [device, setDevice] = useState([]);
  const [data, setData] = useState();
  const [btnItems, setBtnItems] = useState([]);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const commandsState = useSelector((state) => state.commands.items);

  const commands = Object.values(commandsState);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const actionResend = {
    key: "command",
    title: t("sendCommandDevice"),
    icon: <SendIcon fontSize="small" />,
    handler: async (commandId) => {
      setLoading(true);

      try {
        const commandResponse = await fetch(
          `/api/v1/devices/command/resend/${commandId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }
        );

        if (commandResponse.ok) {
          const response = await fetch(
            `/api/v1/devices/` +
              id +
              `/command?${qs.stringify(getParams(tableParams))}`
          );
          if (response.ok) {
            const objResponse = await response.json();
            dispatch(commandsActions.refresh(objResponse.results));
            setTableParams({
              ...tableParams,
              pagination: {
                ...tableParams.pagination,
                total: objResponse.info.totalCount,
              },
            });
          }
        }
      } finally {
        setLoading(false);
        await delay(4000);
        setTimestamp(Date.now());
      }
    },
  };

  const actionNonCustom = async (command) => {
    setLoading(true);

    try {
      const path = `/api/v1/devices/${id}/command`;

      const body = {
        name: t(prefixString("command", command)),
        type: command,
        command: "-",
      };

      const commandResponse = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (commandResponse.ok) {
        const response = await fetch(
          `/api/v1/devices/` +
            id +
            `/command?${qs.stringify(getParams(tableParams))}`
        );
        if (response.ok) {
          const objResponse = await response.json();
          dispatch(commandsActions.refresh(objResponse.results));
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: objResponse.info.totalCount,
            },
          });
        }
      }
    } finally {
      setLoading(false);
      await delay(4000);
      setTimestamp(Date.now());
    }
  };

  const columns = [
    {
      title: t("commandName"),
      dataIndex: "name",
      render: (name) => `${name}`,
      width: "20%",

      defaultSortOrder: "descend",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t("commandType"),
      dataIndex: "type",
    },
    {
      title: t("commandDevice"),
      dataIndex: "command",
    },
    {
      title: t("commandStatus"),
      dataIndex: "status",
      render: (status) =>
        !status ? (
          <CircularProgress size={24} />
        ) : (
          <CheckIcon color="success" size={24} />
        ),
    },
    {
      title: t("commandDate"),
      dataIndex: "created_at",
      render: (created_at) =>
        `${formatTime(created_at, "date")} ${formatTime(created_at, "time")}`,
    },
    {
      title: "",
      key: "action",
      width: "100px",
      render: (_, record) => (
        <Space size="middle">
          <CollectionActions
            itemId={record.id}
            endpoint={"devices/" + id + "/command"}
            setTimestamp={setTimestamp}
            customActions={[actionResend]}
          />
        </Space>
      ),
    },
  ];

  const getParams = (params) => ({
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

  useEffectAsync(async () => {
    setLoading(true);

    try {
      const deviceResponse = await fetch("/api/devices/" + id);
      if (deviceResponse.ok) {
        setDevice(await deviceResponse.json());

        const response = await fetch(
          `/api/v1/devices/` +
            id +
            `/command?${qs.stringify(getParams(tableParams))}`
        );
        if (response.ok) {
          const objResponse = await response.json();
          dispatch(commandsActions.refresh(objResponse.results));
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: objResponse.info.totalCount,
            },
          });
        } else {
          throw Error(await response.text());
        }
      }
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(tableParams), timestamp]);

  const keyGetter = (item) => item.id;
  const titleGetter = (item) => item.name;
  useEffectAsync(async () => {
    const typeResponse = await fetch(
      `/api/commands/types?${new URLSearchParams({
        deviceId: id,
      }).toString()}`
    );
    if (typeResponse.ok) {
      setBtnItems(await typeResponse.json());
    }
    // console.log(atypeResponse.json());
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={12}>
        <Stack spacing={3}>
          <MainCard>
            <Grid>
              <Stack spacing={1}>
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    // justifyContent="space-between"
                    alignItems="center"
                    spacing={0}
                  >
                    <Grid item xs={1}>
                      Name
                    </Grid>
                    <Grid>: {device.name}</Grid>
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
                      Imei
                    </Grid>
                    <Grid>: {device.uniqueId}</Grid>
                  </Stack>
                </Grid>
              </Stack>
            </Grid>
          </MainCard>
          <MainCard
            title={t("commandDevice")}
            secondary={
              <PopupState variant="popover" popupId="command-popup-menu">
                {(popupState) => (
                  <React.Fragment>
                    <Button variant="contained" {...bindTrigger(popupState)}>
                      {t("sendCommandDevice")}
                    </Button>
                    <Menu {...bindMenu(popupState)}>
                      {btnItems.map((item) => {
                        if (item.type == "custom") {
                          return (
                            <MenuItem
                              component={Link}
                              to={"/device/" + id + "/command"}
                              // key={keyGetter(item)}
                              // value={keyGetter(item)}
                            >
                              {t(prefixString("command", item.type))}
                            </MenuItem>
                          );
                        } else {
                          return (
                            <MenuItem
                              onClick={() => actionNonCustom(item.type)}
                            >
                              {t(prefixString("command", item.type))}
                            </MenuItem>
                          );
                        }
                      })}
                    </Menu>
                  </React.Fragment>
                )}
              </PopupState>
              // <AnimateButton>
              //   <Button
              //     component={Link}
              //     to={"/device/" + id + "/command"}
              //     type="submit"
              //     variant="contained"
              //     color="primary"
              //   >
              //     {t("sharedNewCommand")}
              //   </Button>
              // </AnimateButton>
            }
          >
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              dataSource={commands}
              pagination={tableParams.pagination}
              loading={loading}
              onChange={handleTableChange}
              // defaultSortOrder={"descend"}
              expandable={{
                expandedRowRender: (record) => (
                  <Grid item xs={12}>
                    {/* <Stack direction="row" spacing={4}>
                      <Typography xs={3}>HEX</Typography>
                      <Typography variant="body2" gutterBottom>
                        : {record.hex}
                      </Typography>
                    </Stack> */}
                    <Stack direction="row" spacing={4}>
                      <Typography xs={3}>{t("deviceResponse")}</Typography>
                      <Typography>: {record.ascii}</Typography>
                    </Stack>
                  </Grid>

                  // <p style={{ margin: 0 }}>{record.hex}</p>
                ),
              }}
            />
          </MainCard>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default DeviceCommandsPage;
