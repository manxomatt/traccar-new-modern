import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import qs from "qs";
import {
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Table, Space } from "antd";
import CommuteIcon from "@mui/icons-material/Commute";

import { useEffectAsync } from "../reactHelper";
import { formatBoolean, formatTime } from "../common/util/formatter";
import { useTranslation } from "../common/components/LocalizationProvider";
import CollectionActions from "../settings/components/CollectionActions";
import { usePreference } from "../common/util/preferences";
import MainCard from "../common/components/mantis/MainCard";
import AnimateButton from "../common/components/mantis/@extended/AnimateButton";
import SearchField from "../common/components/SearcFIeld";
import LinkDevice from "../common/components/LinkDevice";

const UsersPage = () => {
  const [mUserId, setMUserId] = useState();
  const hours12 = usePreference("twelveHourFormat");
  const t = useTranslation();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [searchKeyword, setSearchKeyword] = useState("");
  const actionDevices = {
    key: "command",
    title: t("addDevice"),
    icon: <CommuteIcon />,
    handler: (userId) => {
      setMUserId(userId);
      showModal();
    },
  };

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
  };

  const columns = [
    {
      title: t("sharedName"),
      dataIndex: "name",
      sorter: false,
      render: (name) => `${name}`,
      width: "20%",
    },

    {
      title: t("userEmail"),
      dataIndex: "email",
    },
    {
      title: t("userAdmin"),
      dataIndex: "administrator",
      render: (administrator) => `${formatBoolean(administrator, t)}`,
    },
    {
      title: t("sharedDisabled"),
      dataIndex: "disabled",
      render: (disabled) => `${formatBoolean(disabled, t)}`,
    },
    {
      title: t("userExpirationTime"),
      dataIndex: "expirationtime",
      render: (expirationtime) =>
        `${formatTime(expirationtime, "date", hours12)}`,
    },

    {
      title: "",
      key: "action",
      width: "100px",
      render: (_, record) => (
        <Space size="middle">
          <CollectionActions
            itemId={record.id}
            editPath="/users/edit"
            endpoint="users"
            setTimestamp={setTimestamp}
            customActions={[actionDevices]}
          />
        </Space>
      ),
    },
  ];
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
      fetch(`/api/v1/users?${qs.stringify(getParams(tableParams))}`)
        .then((res) => res.json())
        .then(({ info, results }) => {
          setData(results);
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
  return (
    <React.Fragment>
      <MainCard
        title={t("settingsUser")}
        secondary={
          <>
            <Stack
              border={"1 px solid blue"}
              xs={12}
              direction={"column"}
              spacing={1}
            >
              <AnimateButton>
                <Button
                  component={Link}
                  to="/users/add"
                  disableElevation
                  fullWidth
                  size="small"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {t("sharedAddUser")}
                </Button>
              </AnimateButton>
            </Stack>
          </>
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
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
        </Stack>
      </MainCard>
      <>
        <Dialog
          fullWidth={true}
          maxWidth={"lg"}
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>{t("sharedDevice")}</DialogTitle>
          <DialogContent>
            <></>
            <LinkDevice
              endpointAll="/api/devices?all=true"
              endpointLinked={`/api/devices?userId=${mUserId}`}
              baseId={mUserId}
              keyBase="userId"
              keyLink="deviceId"
              //   label={t("deviceTitle")}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t("closeTitle")}</Button>
          </DialogActions>
        </Dialog>
      </>
    </React.Fragment>
  );
};

export default UsersPage;