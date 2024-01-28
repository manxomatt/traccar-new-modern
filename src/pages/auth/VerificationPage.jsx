import { Link } from "react-router-dom";
import React, { useState } from "react";
// import { Link as RouterLink } from "react-router-dom";
import usePersistedState from "../../common/util/usePersistedState";
import {
  Grid,
  Stack,
  Typography,
  InputLabel,
  OutlinedInput,
  Button,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import {
  snackBarDurationShortMs,
  snackBarDurationLongMs,
} from "../../common/util/duration";
// project import
import AuthLogin from "./AuthLogin";
import AuthWrapper from "./AuthWrapper";
import { Formik } from "formik";
import * as Yup from "yup";

import AnimateButton from "../../common/components/mantis/@extended/AnimateButton";
import {
  useLocalization,
  useTranslation,
} from "../../common/components/LocalizationProvider";
// ================================|| LOGIN ||================================ //

const VerificationPage = () => {
  const t = useTranslation();
  const [alertOpen, setAlertOpen] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const [failed, setFailed] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
            sx={{ mb: { xs: -0.5, sm: 0.5 } }}
          >
            <Typography variant="h3">Email Verification</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Formik
            initialValues={{
              email: "",
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Must be a valid email")
                .max(255)
                .required("Email is required"),
            })}
            onSubmit={async (
              values,
              { setErrors, setStatus, setSubmitting }
            ) => {
              event.preventDefault();
              setShowLoader(true);
              setFailed(false);
              try {
                // const query = `email=${encodeURIComponent(values.email)}`;

                const response = await fetch("/api/users/code/request", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                  //body: new URLSearchParams(query),
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
                setFailed(true);
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
              <form
                noValidate
                onSubmit={handleSubmit}
                autoComplete="new-password"
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="email-login">
                        Email Address
                      </InputLabel>
                      <OutlinedInput
                        id="email-login"
                        type="email"
                        value={values.email}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        fullWidth
                        autoComplete="new-password"
                        autoFocus
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

                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                  )}
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
                          t("sendEmail")
                        ) : (
                          <CircularProgress size={24} />
                        )}
                      </Button>
                    </AnimateButton>
                  </Grid>
                  {alertOpen && (
                    <Grid item xs={12}>
                      <Stack sx={{ width: "100%" }} spacing={2}>
                        <Alert
                          open={alertOpen}
                          variant="outlined"
                          severity="error"
                        >
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
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};
export default VerificationPage;
