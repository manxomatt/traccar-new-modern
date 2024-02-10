import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Grid,
  Stack,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CachedIcon from "@mui/icons-material/Cached";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import EditDataView from "../settings/components/EditDataView";
import EditAttributesAccordion from "../settings/components/EditAttributesAccordion";
import { useTranslation } from "../common/components/LocalizationProvider";
import useUserAttributes from "../common/attributes/useUserAttributes";
import { sessionActions } from "../store";
import SelectField from "../common/components/SelectField";
import SettingsMenu from "../settings/components/SettingsMenu";
import useCommonUserAttributes from "../common/attributes/useCommonUserAttributes";
import {
  useAdministrator,
  useRestriction,
  useManager,
} from "../common/util/permissions";
import useQuery from "../common/util/useQuery";
import { useCatch } from "../reactHelper";
import useMapStyles from "../map/core/useMapStyles";
import { map } from "../map/core/MapView";

const useStyles = makeStyles((theme) => ({
  details: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
}));

const UserPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();
  const manager = useManager();
  const fixedEmail = useRestriction("fixedEmail");

  const currentUser = useSelector((state) => state.session.user);
  const registrationEnabled = useSelector(
    (state) => state.session.server.registration
  );
  const openIdForced = useSelector((state) => state.session.server.openIdForce);
  const totpEnable = useSelector(
    (state) => state.session.server.attributes.totpEnable
  );
  const totpForce = useSelector(
    (state) => state.session.server.attributes.totpForce
  );

  const mapStyles = useMapStyles();
  const commonUserAttributes = useCommonUserAttributes(t);
  const userAttributes = useUserAttributes(t);

  const { id } = useParams();
  const [item, setItem] = useState(
    id === currentUser.id.toString() ? currentUser : null
  );

  const [deleteEmail, setDeleteEmail] = useState();
  const [deleteFailed, setDeleteFailed] = useState(false);

  const handleDelete = useCatch(async () => {
    if (deleteEmail === currentUser.email) {
      setDeleteFailed(false);
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        navigate("/login");
        dispatch(sessionActions.updateUser(null));
      } else {
        throw Error(await response.text());
      }
    } else {
      setDeleteFailed(true);
    }
  });

  const handleGenerateTotp = useCatch(async () => {
    const response = await fetch("/api/users/totp", { method: "POST" });
    if (response.ok) {
      setItem({ ...item, totpKey: await response.text() });
    } else {
      throw Error(await response.text());
    }
  });

  const query = useQuery();
  const [queryHandled, setQueryHandled] = useState(false);
  const attribute = query.get("attribute");

  useEffect(() => {
    if (!queryHandled && item && attribute) {
      if (!item.attributes.hasOwnProperty("attribute")) {
        const updatedAttributes = { ...item.attributes };
        updatedAttributes[attribute] = "";
        setItem({ ...item, attributes: updatedAttributes });
      }
      setQueryHandled(true);
    }
  }, [item, queryHandled, setQueryHandled, attribute]);

  const onItemSaved = (result) => {
    if (result.id === currentUser.id) {
      dispatch(sessionActions.updateUser(result));
    }
  };

  const validate = () =>
    item &&
    item.name &&
    item.email &&
    (item.id || item.password) &&
    (admin || !totpForce || item.totpKey);

  const today = new Date();

  return (
    <EditDataView
      endpoint="users"
      item={item}
      setItem={setItem}
      defaultItem={admin ? { deviceLimit: -1 } : {}}
      validate={validate}
      onItemSaved={onItemSaved}
      menu={<SettingsMenu />}
      breadcrumbs={["settingsTitle", "settingsUser"]}
      cardTitle={t("settingsUser")}
    >
      {item && (
        <>
          <Stack spacing={2}>
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={2}>
                  {t("sharedName")}
                </Grid>
                <Grid item xs={4}>
                  <OutlinedInput
                    fullWidth
                    size="small"
                    value={item.name || ""}
                    onChange={(e) => setItem({ ...item, name: e.target.value })}
                    // label={t("sharedName")}
                  />
                </Grid>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={2}>
                  {t("userEmail")}
                </Grid>
                <Grid item xs={4}>
                  <OutlinedInput
                    fullWidth
                    value={item.email || ""}
                    onChange={(e) =>
                      setItem({ ...item, email: e.target.value })
                    }
                    // label={t("userEmail")}
                    disabled={fixedEmail}
                  />
                </Grid>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={2}>
                  {t("userPassword")}
                </Grid>
                <Grid item xs={4}>
                  <OutlinedInput
                    fullWidth
                    type="password"
                    onChange={(e) =>
                      setItem({ ...item, password: e.target.value })
                    }
                  />
                </Grid>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={2}>
                  {t("userExpirationTime")}
                </Grid>
                <Grid item xs={1}>
                  <OutlinedInput
                    fullWidth
                    type="date"
                    value={
                      (item.expirationTime &&
                        dayjs(item.expirationTime)
                          .locale("en")
                          .format("YYYY-MM-DD")) ||
                      setItem({
                        ...item,
                        expirationTime: dayjs(
                          today.getFullYear() +
                            1 +
                            "-" +
                            ("0" + (today.getMonth() + 1)).slice(-2) +
                            "-" +
                            ("0" + today.getDate()).slice(-2)
                        )
                          .locale("en")
                          .format("YYYY-MM-DD"),
                      })
                    }
                    onChange={(e) =>
                      setItem({
                        ...item,
                        expirationTime: dayjs(e.target.value, "YYYY-MM-DD")
                          .locale("en")
                          .format(),
                      })
                    }
                    disabled={!manager}
                  />
                </Grid>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={2}>
                  {t("userDeviceLimit")}
                </Grid>
                <Grid item xs={1}>
                  <OutlinedInput
                    fullWidth
                    type="number"
                    value={item.deviceLimit || 0}
                    onChange={(e) =>
                      setItem({
                        ...item,
                        deviceLimit: Number(e.target.value),
                      })
                    }
                    disabled={!admin}
                  />
                </Grid>
              </Stack>
            </Grid>
            {/* <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={1}>
                  {t("userUserLimit")}
                </Grid>
                <Grid item xs={1}>
                  <OutlinedInput
                    fullWidth
                    type="number"
                    value={item.userLimit || 0}
                    onChange={(e) =>
                      setItem({ ...item, userLimit: Number(e.target.value) })
                    }
                    disabled={!admin}
                  />
                </Grid>
              </Stack>
            </Grid> */}
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={2}></Grid>
                <Grid item xs={2}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.disabled}
                          onChange={(e) =>
                            setItem({ ...item, disabled: e.target.checked })
                          }
                        />
                      }
                      label={t("sharedDisabled")}
                      disabled={!manager}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.administrator}
                          onChange={(e) =>
                            setItem({
                              ...item,
                              administrator: e.target.checked,
                            })
                          }
                        />
                      }
                      label={t("userAdmin")}
                      disabled={!admin}
                    />
                    {/* <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.readonly}
                          onChange={(e) =>
                            setItem({ ...item, readonly: e.target.checked })
                          }
                        />
                      }
                      label={t("serverReadonly")}
                      disabled={!manager}
                    /> */}
                    {/* <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.deviceReadonly}
                          onChange={(e) =>
                            setItem({
                              ...item,
                              deviceReadonly: e.target.checked,
                            })
                          }
                        />
                      }
                      label={t("userDeviceReadonly")}
                      disabled={!manager}
                    /> */}
                    {/* <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.limitCommands}
                          onChange={(e) =>
                            setItem({
                              ...item,
                              limitCommands: e.target.checked,
                            })
                          }
                        />
                      }
                      label={t("userLimitCommands")}
                      disabled={!manager}
                    /> */}
                    {/* <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.disableReports}
                          onChange={(e) =>
                            setItem({
                              ...item,
                              disableReports: e.target.checked,
                            })
                          }
                        />
                      }
                      label={t("userDisableReports")}
                      disabled={!manager}
                    /> */}
                    {/* <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.fixedEmail}
                          onChange={(e) =>
                            setItem({ ...item, fixedEmail: e.target.checked })
                          }
                        />
                      }
                      label={t("userFixedEmail")}
                      disabled={!manager}
                    /> */}
                  </FormGroup>
                </Grid>
              </Stack>
            </Grid>
          </Stack>
        </>
      )}
    </EditDataView>
  );
};

export default UserPage;
