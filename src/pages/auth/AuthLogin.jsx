import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import usePersistedState from "../../common/util/usePersistedState";

import {
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
  Alert,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import AnimateButton from "../../common/components/mantis/@extended/AnimateButton";
import { sessionActions } from "../../store";
import {
  useLocalization,
  useTranslation,
} from "../../common/components/LocalizationProvider";
import {
  handleLoginTokenListeners,
  nativeEnvironment,
  nativePostMessage,
} from "../../common/components/NativeInterface";

// assets
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

// ============================|| FIREBASE - LOGIN ||============================ //

const useStyles = makeStyles((theme) => ({
  options: {
    position: "fixed",
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  extraContainer: {
    display: "flex",
    gap: theme.spacing(2),
  },
  registerButton: {
    minWidth: "unset",
  },
  resetPassword: {
    cursor: "pointer",
    textAlign: "center",
    marginTop: theme.spacing(2),
  },
}));

const AuthLogin = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const t = useTranslation();

  const [failed, setFailed] = useState(false);
  const [email, setEmail] = usePersistedState("loginEmail", "");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [resend, setResend] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");

  const generateLoginToken = async () => {
    if (nativeEnvironment) {
      let token = "";
      try {
        const expiration = dayjs().add(6, "months").toISOString();
        const response = await fetch("/api/session/token", {
          method: "POST",
          body: new URLSearchParams(`expiration=${expiration}`),
        });
        if (response.ok) {
          token = await response.text();
        }
      } catch (error) {
        token = "";
      }
      nativePostMessage(`login|${token}`);
    }
  };

  const [checked, setChecked] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          event.preventDefault();
          setFailed(false);
          try {
            const query = `email=${encodeURIComponent(
              values.email
            )}&password=${encodeURIComponent(values.password)}`;

            const response = await fetch("/api/session", {
              method: "POST",
              body: new URLSearchParams(
                code.length ? query + `&code=${code}` : query
              ),
            });

            if (response.ok) {
              const user = await response.json();

              generateLoginToken();
              dispatch(sessionActions.updateUser(user));
              navigate("/");
            } else if (
              response.status === 401 &&
              response.headers.get("WWW-Authenticate") === "TOTP"
            ) {
              setCodeEnabled(true);
            } else if (response.status == 400) {
              setErrorResponse(await response.text());
              setAlertOpen(true);
              setResend(true);
            } else {
              setErrorResponse(await response.text());
              setAlertOpen(true);
              setResend(false);
              // throw Error(await response.text());
            }
          } catch (error) {
            setFailed(true);
            setPassword("");
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
          <form noValidate onSubmit={handleSubmit} autoComplete="new-password">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
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
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    name="password"
                    autoComplete="new-password"
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
                    placeholder="Enter password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-password-login"
                    >
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="h6">Keep me sign in</Typography>
                    }
                  />
                  <Link
                    variant="h6"
                    component={RouterLink}
                    to=""
                    color="text.primary"
                  >
                    Forgot Password?
                  </Link>
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
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
              {alertOpen && (
                <Grid item xs={12}>
                  <Stack sx={{ width: "100%" }} spacing={2}>
                    <Alert open={alertOpen} variant="outlined" severity="error">
                      {errorResponse}
                      {resend && (
                        <Typography
                          // component={Link}
                          // to="/email-verify"
                          variant="body1"
                          sx={{ textDecoration: "none" }}
                          color="primary"
                        >
                          Check your email or{" "}
                          <a id="anchor" href={"/email-verify"}>
                            Resend verification code
                          </a>
                        </Typography>
                      )}
                    </Alert>
                  </Stack>
                </Grid>
              )}
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
