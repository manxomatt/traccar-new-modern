import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Stack, Chip, Typography } from "@mui/material";

// project import
import DrawerHeaderStyled from "./DrawerHeaderStyled";
import Logo from "../../../../common/components/mantis/Logo";

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = ({ open }) => {
  const theme = useTheme();

  return (
    // only available in paid version
    <DrawerHeaderStyled theme={theme} open={open}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>MULTITRACKING.NET</Typography>
        {/* <Logo /> */}
        {/* <Chip
          label={import.meta.env.VITE_APP_VERSION} //{process.env.VITE_APP_VERSION} //
          size="small"
          sx={{
            height: 16,
            "& .MuiChip-label": { fontSize: "0.625rem", py: 0.25 },
          }}
          component="a"
          href="https://github.com/codedthemes/mantis-free-react-admin-template"
          target="_blank"
          clickable
        /> */}
      </Stack>
    </DrawerHeaderStyled>
  );
};

DrawerHeader.propTypes = {
  open: PropTypes.bool,
};

export default DrawerHeader;
