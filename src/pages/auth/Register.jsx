import React, { useState } from "react";
import { Link } from "react-router-dom";

// material-ui
import { Grid, Stack, Typography, TextField } from "@mui/material";
import AuthRegister from "./AuthRegister";
import AuthWrapper from "./AuthWrapper";
import { useTranslation } from "../../common/components/LocalizationProvider";

const Register = () => {
  const t = useTranslation();
  return (
    <React.Fragment>
      <AuthWrapper>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="baseline"
              sx={{ mb: { xs: -0.5, sm: 0.5 } }}
            >
              <Typography variant="h3">{t("loginRegister")}</Typography>
              <Typography
                component={Link}
                to="/login"
                variant="body1"
                sx={{ textDecoration: "none" }}
                color="primary"
              >
                Already have an account?
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <AuthRegister />
          </Grid>
        </Grid>
      </AuthWrapper>
    </React.Fragment>
  );
};

export default Register;
