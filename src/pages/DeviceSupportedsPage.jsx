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
import { Table, Space, Grid, Typography } from "antd";
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
import { useAdministrator } from "../common/util/permissions";

const DeviceSupportedsPage = () => {
  const [mUserId, setMUserId] = useState();
  const t = useTranslation();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [searchKeyword, setSearchKeyword] = useState("");
  const administrator = useAdministrator();
  const [open, setOpen] = useState(false);

  const columns = [
    {
      title: t("sharedName"),
      dataIndex: "name",
      sorter: false,
      render: (name) => `${name}`,
      width: "20%",
    },

    {
      title: t("sharedType"),
      dataIndex: "type",
    },

    {
      title: t("commandPort"),
      dataIndex: "port",
    },
    {
      title: "",
      key: "action",
      width: "100px",
      render: (_, record) => (
        <Space size="middle">
          <CollectionActions
            itemId={record.id}
            editPath="/devices/supported/edit"
            endpoint="v1/devices/supported"
            setTimestamp={setTimestamp}
          />
        </Space>
      ),
    },
  ];

  if (!administrator) {
    columns.splice(3, 1);
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
      fetch(`/api/v1/devices/supported?${qs.stringify(getParams(tableParams))}`)
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
        title={t("supportedDevice")}
        secondary={
          administrator && (
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
                    to="/devices/supported/add"
                    disableElevation
                    fullWidth
                    size="small"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {t("sharedAddDevice")}
                  </Button>
                </AnimateButton>
              </Stack>
            </>
          )
        }
      >
        <Stack spacing={1}>
          <Typography variant="h3" component="h4">
            MULTITRACKING.NET SERVER IP
          </Typography>
          <Typography variant="h5" component="h6">
            Domain Format : id.multitracking.net
          </Typography>
          <Typography variant="h5" component="h6">
            IP Format : 202.83.121.196
          </Typography>
          <Typography></Typography>

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
            pagination={false} //tableParams.pagination}
            loading={loading}
            scroll={{ x: 2000, y: 800 }}
            onChange={handleTableChange}
          />
        </Stack>
      </MainCard>
    </React.Fragment>
  );
};

export default DeviceSupportedsPage;
