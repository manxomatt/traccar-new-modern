import PropTypes from "prop-types";

// material-ui
import { Box, Grid, Typography, Stack } from "@mui/material";

// project import
import AuthCard from "./AuthCard";
import Logo from "../../common/components/mantis/Logo";
import AuthFooter from "../../common/components/mantis/cards/AuthFooter";

// assets
import AuthBackground from "../../assets/images/auth/AuthBackground";
import { Link } from "react-router-dom";

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper = ({ children }) => (
  <Box sx={{ minHeight: "100vh" }}>
    <AuthBackground />
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      sx={{
        minHeight: "100vh",
      }}
    >
      <Grid item xs={12} sx={{ ml: 3, mt: 3 }}>
        {/* <Logo /> */}
        {/* <Typography>MULTITRACKING.NET</Typography> */}
      </Grid>
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          container
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={11} md={6} spacing={2} paddingTop={"10px"}>
            <center>
              <Typography variant="h4">MULTITRACKING</Typography>
            </center>{" "}
          </Grid>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            paddingTop={"20px"}
            // border={"1px solid blue"}
            sx={{
              minHeight: "40vh",
              // minHeight: {
              //   xs: "calc(100vh - 300px)",
              //   md: "calc(100vh - 340px)",
              // },
            }}
          >
            <Grid item>
              <AuthCard>{children}</AuthCard>
            </Grid>
          </Grid>
          <Grid item xs={11} md={3} spacing={2}>
            <Grid item xs={12}>
              <Stack spacing={1} alignItems="center">
                <Typography>Server Domain : id.multitracking.net</Typography>
                <Typography>Server IP : 202.83.121.196 </Typography>
                <Typography>Server Location : Jakarta Indonesia </Typography>
                <Typography>
                  <Link to={"/devices/supported"} target="_blank">
                    Supported Device
                  </Link>{" "}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
        <AuthFooter />
      </Grid>
    </Grid>
  </Box>
);

AuthWrapper.propTypes = {
  children: PropTypes.node,
};

export default AuthWrapper;
