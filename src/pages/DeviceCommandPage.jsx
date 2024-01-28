import React, { useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DropzoneArea } from "react-mui-dropzone";
import EditItemView from "../settings/components/EditItemView";
import EditAttributesAccordion from "../settings/components/EditAttributesAccordion";
import SelectField from "../common/components/SelectField";
import { prefixString } from "../common/util/stringUtils";
import deviceCategories from "../common/util/deviceCategories";
import { useEffectAsync } from "../reactHelper";
import { useTranslation } from "../common/components/LocalizationProvider";
import useDeviceAttributes from "../common/attributes/useDeviceAttributes";
import { useAdministrator } from "../common/util/permissions";
import SettingsMenu from "../settings/components/SettingsMenu";
import useCommonDeviceAttributes from "../common/attributes/useCommonDeviceAttributes";
import { useCatch } from "../reactHelper";
import CollectionFab from "../settings/components/CollectionFab";
import SearchHeader, {
  filterByKeyword,
} from "../settings/components/SearchHeader";
import PageLayout from "../common/components/PageLayout";
import CollectionActions from "../settings/components/CollectionActions";
import TableShimmer from "../common/components/TableShimmer";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
} from "@mui/material";

import useSettingsStyles from "../settings/common/useSettingsStyles";
import { useNavigate } from "react-router-dom";
import MainCard from "../common/components/mantis/MainCard";
import * as Yup from "yup";
import { Formik } from "formik";
import AnimateButton from "../common/components/mantis/@extended/AnimateButton";

const DeviceCommandPage = () => {
  const navigate = useNavigate();
  const [item, setItem] = useState({});
  const t = useTranslation();

  const { id } = useParams();
  let url = "/api/v1/devices/" + id + "/command";
  let method = "POST";
  // if (fid !== undefined) {
  //   url = "/api/devices/" + id + "/command/" + fid;
  //   method = "PUT";
  // }

  const [timestamp, setTimestamp] = useState(Date.now());
  const [forward, setForward] = useState([]);
  const [commandAttr, setCommandAttr] = useState([]);
  const [device, setDevice] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffectAsync(async () => {
    setLoading(true);

    try {
      const deviceResponse = await fetch("/api/devices/" + id);

      if (deviceResponse.ok) {
        setDevice(await deviceResponse.json());
        // if (fid) {
        //   const forwardResponse = await fetch(
        //     "/api/devices/" + id + "/forward/" + fid
        //   );
        //   setForward(await forwardResponse.json());
        // }
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  return (
    <Grid container spacing={3}>
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
                    <Grid xs={1}>Name</Grid>
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
                    <Grid xs={1}>Imei</Grid>
                    <Grid>: {device.uniqueId}</Grid>
                  </Stack>
                </Grid>
              </Stack>
            </Grid>
          </MainCard>
          <MainCard>
            <>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  name: commandAttr.name,
                  type: commandAttr.type,
                  command: commandAttr.command,
                }}
                // validationSchema={Yup.object().shape({
                //   email: Yup.string()
                //     .server("Must be a valid email")
                //     .max(255)
                //     .required("Email is required"),
                //   port: Yup.string().max(255).required("Password is required"),
                // })}
                onSubmit={async (
                  values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  try {
                    const response = await fetch(url, {
                      method: method,
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(values),
                    });
                    if (response.ok) {
                      navigate(-1);
                    } else {
                      throw Error(await response.text());
                    }
                  } catch (err) {
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
                    setSubmitting(false);
                  }
                  // console.log(values);
                }}
              >
                {({ handleChange, handleSubmit, isSubmitting, values }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3} item xs={3}>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="command-name">
                            {t("commandName")}
                          </InputLabel>
                          <OutlinedInput
                            fullWidth
                            id="command-name"
                            name="name"
                            placeholder=""
                            onChange={handleChange}
                            value={values.name || ""}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="command-type">
                            {t("commandType")}
                          </InputLabel>
                          <SelectField
                            name="type"
                            id="command-type"
                            value={item.type || ""}
                            onChange={(e) => {
                              setItem({
                                ...item,
                                type: e.target.value,
                                attributes: {},
                              });

                              setCommandAttr({
                                name: values.name,
                                type: e.target.value,
                                command: values.command,
                              });
                            }}
                            endpoint={
                              id
                                ? `/api/commands/types?${new URLSearchParams({
                                    deviceId: id,
                                  }).toString()}`
                                : "/api/commands/types"
                            }
                            keyGetter={(it) => it.type}
                            titleGetter={(it) =>
                              t(prefixString("command", it.type))
                            }
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="command-device">
                            {t("commandDevice")}
                          </InputLabel>
                          <OutlinedInput
                            fullWidth
                            id="command-device"
                            name="command"
                            placeholder=""
                            onChange={handleChange}
                            value={values.command || ""}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Grid item xs={6}>
                            <AnimateButton>
                              <Button
                                fullWidth
                                type="button"
                                color="primary"
                                variant="outlined"
                                onClick={() => navigate(-1)}
                                // disabled={!item}
                                xs={1}
                              >
                                {t("sharedCancel")}
                              </Button>
                            </AnimateButton>
                          </Grid>
                          <Grid item xs={6}>
                            <AnimateButton>
                              <Button
                                disableElevation
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="primary"
                              >
                                {t("commandSend")}
                              </Button>
                            </AnimateButton>
                          </Grid>
                        </Stack>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Formik>
            </>
          </MainCard>
        </Stack>
      </Grid>
    </Grid>
    // </PageLayout>
  );
};

export default DeviceCommandPage;
