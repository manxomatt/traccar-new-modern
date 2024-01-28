import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FormControlLabel,
  Checkbox,
  FormGroup,
  OutlinedInput,
  Grid,
  Stack,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import EditDataView from "../settings/components/EditDataView";
import { useTranslation } from "../common/components/LocalizationProvider";
import useUserAttributes from "../common/attributes/useUserAttributes";
import { sessionActions } from "../store";
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

const useStyles = makeStyles((theme) => ({
  details: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
}));

const DeviceSupportedPage = () => {
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

  const validate = () => item && item.name && item.type && item.port;

  return (
    <EditDataView
      endpoint="v1/devices/supported"
      item={item}
      setItem={setItem}
      validate={validate}
      onItemSaved={onItemSaved}
      menu={<SettingsMenu />}
      breadcrumbs={["settingsTitle", "settingsUser"]}
      cardTitle={t("supportedDevice")}
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
                  />
                </Grid>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={2}>
                  {t("sharedType")}
                </Grid>
                <Grid item xs={4}>
                  <OutlinedInput
                    fullWidth
                    type="text"
                    value={item.type || ""}
                    onChange={(e) => setItem({ ...item, type: e.target.value })}
                    // label={t("userEmail")}
                    // disabled={fixedEmail}
                  />
                </Grid>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={2}>
                  {t("commandPort")}
                </Grid>
                <Grid item xs={4}>
                  <OutlinedInput
                    fullWidth
                    value={item.port || ""}
                    type="text"
                    onChange={(e) => setItem({ ...item, port: e.target.value })}
                  />
                </Grid>
              </Stack>
            </Grid>
          </Stack>
        </>
      )}
    </EditDataView>
  );
};

export default DeviceSupportedPage;
