import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffectAsync } from "../reactHelper";
import qs from "qs";
import {
  Grid,
  Stack,
  // Table,
  TableRow,
  TableCell,
  IconButton,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import CollectionActions from "../settings/components/CollectionActions";

import MainCard from "../common/components/mantis/MainCard";
import { useTranslation } from "../common/components/LocalizationProvider";
import useSettingsStyles from "../settings/common/useSettingsStyles";

import { commandsActions } from "../store";
import AnimateButton from "../common/components/mantis/@extended/AnimateButton";
import { Table, Space } from "antd";
import CheckIcon from "@mui/icons-material/Check";
import { formatTime } from "../common/util/formatter";

const DeviceCommandsPageOld = () => {
  const { id } = useParams();
  const t = useTranslation();
  const dispatch = useDispatch();

  const [device, setDevice] = useState([]);
  const [data, setData] = useState();
  const [items, setItems] = useState([]);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const commandsState = useSelector((state) => state.commands.items);

  const commands = Object.values(commandsState);

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
        } else {
          throw Error(await response.text());
        }
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  const columns = [
    {
      title: t("commandName"),
      dataIndex: "name",
      sorter: false,
      render: (name) => `${name}`,
      width: "20%",
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
              <AnimateButton>
                <Button
                  component={Link}
                  to={"/device/" + id + "/command"}
                  // href="/devices/add" disableElevation fullWidth size="small"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {t("sharedNew")}
                </Button>
              </AnimateButton>
            }
          >
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              dataSource={commands}
              expandable={{
                expandedRowRender: (record) => (
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={4}>
                      <Typography xs={3}>HEX</Typography>
                      <Typography variant="body2" gutterBottom>
                        : {record.hex}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={4}>
                      <Typography xs={3}>ASCII</Typography>
                      <Typography>: {record.ascii}</Typography>
                    </Stack>
                  </Grid>

                  // <p style={{ margin: 0 }}>{record.hex}</p>
                ),
              }}
              // pagination={tableParams.pagination}
              // loading={loading}
              // onChange={handleTableChange}
            />
          </MainCard>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default DeviceCommandsPageOld;
