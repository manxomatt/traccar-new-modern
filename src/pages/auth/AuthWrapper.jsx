import PropTypes from "prop-types";

// material-ui
import { Box, Grid, Typography } from "@mui/material";

// project import
import AuthCard from "./AuthCard";
import Logo from "../../common/components/mantis/Logo";
import AuthFooter from "../../common/components/mantis/cards/AuthFooter";

// assets
import AuthBackground from "../../assets/images/auth/AuthBackground";

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper = ({ children }) => (
  <Box sx={{ minHeight: "100vh" }}>
    <AuthBackground />
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
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
              <Typography variant="h4">MULTITRACKING.NET</Typography>
            </center>{" "}
            <Typography variant="h6" paddingTop={"10px"}>
              Multitracking.net memberikan layanan berupa fitur untuk tracking
              kendaraan ke beberapa aplikasi server sekaligus dalam waktu yang
              bersamaan.
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            paddingTop={"20px"}
            // border={"1px solid blue"}
            sx={{
              minHeight: {
                xs: "calc(100vh - 600px)",
                md: "calc(100vh - 540px)",
              },
            }}
          >
            <Grid item>
              <AuthCard>{children}</AuthCard>
            </Grid>
          </Grid>
          <Grid item xs={11} md={6} spacing={2}>
            <Typography>
              Sebagai contoh, misalnya anda menggunakan GPS Tracker Concox
              GT06N, maka anda bisa tracking GPS Tracker tersebut di &nbsp;
              <b>
                Server Tracksolid, GSI, IDTrack, dan atau server lain secara
                bersamaan.
              </b>
              <br />
              <br />
              <b>KEUNTUNGAN MENGGUNAKAN LAYANAN MULTITRACKING.NET:</b>
              <ul>
                <li>
                  {" "}
                  Jika ada salah satu server mengalami gangguan, anda tetap bisa
                  tracking kendaraan menggunakan server lainnya, tanpa merubah
                  settingan apapun di GPS Tracker.{" "}
                </li>
                <li>
                  Jika kendaraan yang dilacak merupakan kendaraan milik Group,
                  anda dan rekan anda bisa memilih menggunaan aplikasi server
                  favorit masing-masing pengguna.{" "}
                </li>
                <li>
                  Jika anda menggunakan server GPS Tracker yang boros pulsa
                  data, maka anda bisa menghemat biaya pulsa data melalui
                  layanan Multitracking.net, dikarenakan Multitracking.net hanya
                  membutuhkan sekitar 25 - 50 MB/bulan untuk GPS Tracker
                  standar. Tunggu apalagi, silahkan mendaftar layanan
                  Multitracking.net secara gratis!
                </li>
              </ul>
            </Typography>
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
