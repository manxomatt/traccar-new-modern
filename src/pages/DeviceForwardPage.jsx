import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { Button, Grid, InputLabel, OutlinedInput, Stack } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useEffectAsync } from "../reactHelper";
import { useTranslation } from "../common/components/LocalizationProvider";

import useSettingsStyles from "../settings/common/useSettingsStyles";
import { useNavigate } from "react-router-dom";
import MainCard from "../common/components/mantis/MainCard";
import { Formik } from "formik";
import AnimateButton from "../common/components/mantis/@extended/AnimateButton";

const useStyles = makeStyles((theme) => ({
  details: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
}));

const DeviceForwardPage = () => {
  const classes = useSettingsStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const { id, fid } = useParams();
  let url = "/api/v1/devices/" + id + "/forward";
  let method = "POST";
  if (fid !== undefined) {
    url = "/api/v1/devices/" + id + "/forward/" + fid;
    method = "PUT";
  }

  const [timestamp, setTimestamp] = useState(Date.now());
  const [forward, setForward] = useState([]);
  const [device, setDevice] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffectAsync(async () => {
    setLoading(true);

    try {
      const deviceResponse = await fetch("/api/devices/" + id);

      if (deviceResponse.ok) {
        setDevice(await deviceResponse.json());
        if (fid) {
          const forwardResponse = await fetch(
            "/api/v1/devices/" + id + "/forward/" + fid
          );
          setForward(await forwardResponse.json());
        }
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
          <MainCard>
            <>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  server: forward.server,
                  port: forward.port,
                  type: "TCP",
                }}
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
                {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values,
                }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3} item xs={3}>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="server-address">
                            Server IP Address
                          </InputLabel>
                          <OutlinedInput
                            id="server-address"
                            type="text"
                            name="server"
                            value={values.server || ""}
                            // onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="0.0.0.0"
                            fullWidth
                            // error={Boolean(touched.email && errors.email)}
                          />
                          {/* {touched.email && errors.email && (
                            <FormHelperText
                              error
                              id="standard-weight-helper-text-email-login"
                            >
                              {errors.email}
                            </FormHelperText>
                          )} */}
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="server-port">Port</InputLabel>
                          <OutlinedInput
                            fullWidth
                            // error={Boolean(touched.password && errors.password)}
                            id="server-port"
                            // type={showPassword ? "text" : "password"}
                            // value={values.password}
                            name="port"
                            value={values.port || ""}
                            // onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="0000"
                          />
                        </Stack>
                      </Grid>

                      {/* {errors.submit && (
                        <Grid item xs={12}>
                          <FormHelperText error>{errors.submit}</FormHelperText>
                        </Grid>
                      )} */}
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
                                {t("save")}
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

export default DeviceForwardPage;
