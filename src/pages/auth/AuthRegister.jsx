import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sessionActions } from "../../store";
import {
  Grid,
  Stack,
  Typography,
  TextField,
  Button,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  IconButton,
  Snackbar,
  FormHelperText,
  Alert,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import {
  snackBarDurationShortMs,
  snackBarDurationLongMs,
} from "../../common/util/duration";
import {
  useLocalization,
  useTranslation,
} from "../../common/components/LocalizationProvider";
import AnimateButton from "../../common/components/mantis/@extended/AnimateButton";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  ConsoleSqlOutlined,
} from "@ant-design/icons";

import * as Yup from "yup";
import { Formik } from "formik";

const authRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const server = useSelector((state) => state.session.server);
  return (
    <React.Fragment>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required("Name is required"),
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          event.preventDefault();
          setShowLoader(true);
          try {
            const response = await fetch("/api/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values), //{ name, email, password, totpKey }),
            });
            if (response.ok) {
              setShowLoader(false);
              setSnackbarOpen(true);
            } else {
              setShowLoader(false);
              setErrorResponse(await response.text());
              setAlertOpen(true);
            }
          } catch (error) {
            // setFailed(true);
            // setPassword("");
          }
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
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name-register">
                    {t("sharedName")}
                  </InputLabel>
                  <OutlinedInput
                    required
                    id="name-register"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name="name"
                    value={values.name}
                    autoComplete="name"
                    autoFocus
                    // onChange={(event) => setName(event.target.value)}
                  />
                  {touched.name && errors.name && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.name}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-register">
                    {t("userEmail")}
                  </InputLabel>
                  <OutlinedInput
                    required
                    id="email-register"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    // autoFocus
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-register">
                    {t("userPassword")}
                  </InputLabel>
                  <OutlinedInput
                    required
                    id="password-register"
                    name="password"
                    value={values.password}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? (
                            <EyeOutlined />
                          ) : (
                            <EyeInvisibleOutlined />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {touched.password && errors.password && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-password-register"
                    >
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
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
                    {!showLoader ? (
                      t("loginRegister")
                    ) : (
                      <CircularProgress size={24} />
                    )}
                  </Button>
                </AnimateButton>
              </Grid>
              {alertOpen && (
                <Grid item xs={12}>
                  <Stack sx={{ width: "100%" }} spacing={2}>
                    <Alert open={alertOpen} variant="outlined" severity="error">
                      {errorResponse}
                    </Alert>
                  </Stack>
                </Grid>
              )}
            </Grid>
          </form>
        )}
      </Formik>
      <Snackbar
        open={snackbarOpen}
        // onClose={() => {
        //   dispatch(
        //     sessionActions.updateServer({ ...server, newServer: false })
        //   );
        //   navigate("/login");
        // }}
        autoHideDuration={snackBarDurationLongMs}
        message={t("loginVerifiedCreated")}
      />
    </React.Fragment>
  );
};

export default authRegister;
