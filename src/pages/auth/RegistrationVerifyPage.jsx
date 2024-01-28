import React, { useState } from "react";
import useQuery from "../../common/util/useQuery";
import { useEffectAsync } from "../../reactHelper";
import AuthWrapper from "./AuthWrapper";
import { Link } from "react-router-dom";
import {
  Grid,
  Stack,
  Typography,
  InputLabel,
  OutlinedInput,
  Button,
  FormHelperText,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { Check, Error } from "@mui/icons-material";
import {
  useLocalization,
  useTranslation,
} from "../../common/components/LocalizationProvider";

const RegistrationVerifyPage = () => {
  const query = useQuery();

  const token = query.get("code");

  const [timestamp, setTimestamp] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [circularLoader, setCirularLoader] = useState(true);
  const [succesResponse, setSuccessResponse] = useState(false);
  const [messageText, setMessageText] = useState("");
  const t = useTranslation();

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users/code/verify?token=" + token);
      const objResponseText = JSON.parse(await response.text());

      if (response.ok) {
        setCirularLoader(false);
        setSuccessResponse(true);
        setMessageText(objResponseText.message);
      } else {
        setCirularLoader(false);
        setSuccessResponse(false);
        setMessageText(objResponseText.message); //response.text().message);
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  return (
    <React.Fragment>
      <AuthWrapper>
        <Grid container item xs={12}>
          <Grid item xs={12}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="baseline"
              sx={{ mb: { xs: -0.5, sm: 0.5 } }}
            >
              <Typography variant="h3">Email Verification</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack
              direction="column"
              xs={12}
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              {!circularLoader ? (
                succesResponse ? (
                  <>
                    <Check sx={{ fontSize: 72 }} color="success" />
                    <Typography variant="h6">{messageText}</Typography>
                    <Typography
                      component={Link}
                      to="/login"
                      variant="body1"
                      sx={{ textDecoration: "none" }}
                      color="primary"
                    >
                      Login
                    </Typography>
                  </>
                ) : (
                  <>
                    <Error sx={{ fontSize: 72 }} xs={12} color="error" />
                    <Typography variant="h6">{messageText}</Typography>
                    <Typography
                      component={Link}
                      to="/login"
                      variant="body1"
                      sx={{ textDecoration: "none" }}
                      color="primary"
                    >
                      Login
                    </Typography>
                  </>
                )
              ) : (
                <CircularProgress size={64} />
              )}
            </Stack>
          </Grid>
        </Grid>
      </AuthWrapper>
    </React.Fragment>
  );
};

export default RegistrationVerifyPage;
