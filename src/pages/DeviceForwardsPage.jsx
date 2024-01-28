import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Grid, Stack, Button } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useEffectAsync } from "../reactHelper";
import { useTranslation } from "../common/components/LocalizationProvider";
import { filterByKeyword } from "../settings/components/SearchHeader";
import CollectionActions from "../settings/components/CollectionActions";
import TableShimmer from "../common/components/TableShimmer";
import { Table, Space, Tag } from "antd";

import useSettingsStyles from "../settings/common/useSettingsStyles";
import { useNavigate } from "react-router-dom";
import MainCard from "../common/components/mantis/MainCard";
import AnimateButton from "../common/components/mantis/@extended/AnimateButton";

const DeviceForwardsPage = () => {
  const navigate = useNavigate();
  const t = useTranslation();

  const { id } = useParams();
  const [data, setData] = useState();
  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [device, setDevice] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [maxServer, setMaxServer] = useState(false);

  const columns = [
    {
      title: t("forwardServer"),
      dataIndex: "server",
      sorter: false,
      render: (server) => `${server}`,
      width: "20%",
    },
    {
      title: t("forwardPort"),
      dataIndex: "port",
    },
    {
      title: t("forwardType"),
      dataIndex: "type",
    },
    {
      title: "",
      key: "action",
      width: "100px",
      render: (_, record) => (
        <Space size="middle">
          <CollectionActions
            itemId={record.id}
            editPath={"/device/" + id + "/forward"}
            endpoint={"devices/" + id + "/forward"}
            setTimestamp={setTimestamp}
          />
        </Space>
      ),
    },
  ];

  useEffectAsync(async () => {
    setLoading(true);

    try {
      const deviceResponse = await fetch("/api/devices/" + id);
      if (deviceResponse.ok) {
        setDevice(await deviceResponse.json());

        const response = await fetch("/api/v1/devices/" + id + "/forward");
        if (response.ok) {
          const data = await response.json();
          setData(data);
          setLoading(false);

          if (data.length > 4) {
            setMaxServer(true);
          } else {
            setMaxServer(false);
          }
        } else {
          throw Error(await response.text());
        }
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  return (
    <React.Fragment>
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
              title={t("forwardDevice")}
              secondary={
                <AnimateButton>
                  {maxServer ? (
                    <Button
                      component={Link}
                      to={"/device/" + id + "/forward"}
                      disableElevation
                      fullWidth
                      size="small"
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled
                    >
                      {t("forwardDestinationServer")}
                    </Button>
                  ) : (
                    <Button
                      component={Link}
                      to={"/device/" + id + "/forward"}
                      disableElevation
                      fullWidth
                      size="small"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      {t("forwardDestinationServer")}
                    </Button>
                  )}
                </AnimateButton>
              }
            >
              <Table
                columns={columns}
                rowKey={(record) => record.id}
                dataSource={data}
                pagination={{ position: [] }}
                // pagination={tableParams.pagination}
                // loading={loading}
                // onChange={handleTableChange}
              />
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default DeviceForwardsPage;
