import React, { useState } from "react";
import dayjs from "dayjs";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DropzoneArea } from "react-mui-dropzone";
import EditItemView from "./components/EditItemView";
import EditAttributesAccordion from "./components/EditAttributesAccordion";
import SelectField from "../common/components/SelectField";
import deviceCategories from "../common/util/deviceCategories";
import { useEffectAsync } from "../reactHelper";
import { useTranslation } from "../common/components/LocalizationProvider";
import useDeviceAttributes from "../common/attributes/useDeviceAttributes";
import { useAdministrator } from "../common/util/permissions";
import SettingsMenu from "./components/SettingsMenu";
import useCommonDeviceAttributes from "../common/attributes/useCommonDeviceAttributes";
import { useCatch } from "../reactHelper";
import SearchHeader, { filterByKeyword } from "./components/SearchHeader";
import PageLayout from "../common/components/PageLayout";
import CollectionActions from "./components/CollectionActions";
import TableShimmer from "../common/components/TableShimmer";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
} from "@mui/material";

import useSettingsStyles from "./common/useSettingsStyles";
import { useNavigate } from "react-router-dom";

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

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/devices/4/forward");
      if (response.ok) {
        // console.log(response.json());
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  return (
    // <PageLayout
    //   menu={<SettingsMenu />}
    //   breadcrumbs={["settingsTitle", "sharedDevice", "sharedConnections"]}
    // >
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>{t("forwardServer")}</TableCell>
          <TableCell>{t("forwardPort")}</TableCell>
          <TableCell>{t("forwardType")}</TableCell>

          <TableCell className={classes.columnAction} />
        </TableRow>
      </TableHead>
      <TableBody>
        {!loading ? (
          items.filter(filterByKeyword(searchKeyword)).map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.server}</TableCell>
              <TableCell>{item.port}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell className={classes.columnAction} padding="none">
                <CollectionActions
                  itemId={item.id}
                  editPath="/settings/device"
                  endpoint="devices"
                  setTimestamp={setTimestamp}
                  // customActions={[actionConnections]}
                  // readonly={deviceReadonly}
                />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableShimmer columns={7} endAction />
        )}
      </TableBody>
    </Table>
    // </PageLayout>
  );
};

export default DeviceForwardPage;
