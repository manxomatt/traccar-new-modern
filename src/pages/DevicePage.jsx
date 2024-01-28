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
  Stack,
  Grid,
  OutlinedInput,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DropzoneArea } from "react-mui-dropzone";
import EditDataView from "../settings/components/EditDataView";
import EditAttributesAccordion from "../settings/components/EditAttributesAccordion";
import SelectField from "../common/components/SelectField";
import deviceCategories from "../common/util/deviceCategories";
import { useTranslation } from "../common/components/LocalizationProvider";
import useDeviceAttributes from "../common/attributes/useDeviceAttributes";
import { useAdministrator } from "../common/util/permissions";
import SettingsMenu from "../settings/components/SettingsMenu";
import useCommonDeviceAttributes from "../common/attributes/useCommonDeviceAttributes";
import { useCatch } from "../reactHelper";

const useStyles = makeStyles((theme) => ({
  details: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
}));

const DevicePage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const admin = useAdministrator();

  const commonDeviceAttributes = useCommonDeviceAttributes(t);
  const deviceAttributes = useDeviceAttributes(t);

  const [item, setItem] = useState();

  const handleFiles = useCatch(async (files) => {
    if (files.length > 0) {
      const response = await fetch(`/api/devices/${item.id}/image`, {
        method: "POST",
        body: files[0],
      });
      if (response.ok) {
        setItem({
          ...item,
          attributes: {
            ...item.attributes,
            deviceImage: await response.text(),
          },
        });
      } else {
        throw Error(await response.text());
      }
    }
  });

  const validate = () => item && item.name && item.uniqueId;

  return (
    <EditDataView
      cardTitle={t("sharedDevice")}
      endpoint="devices"
      item={item}
      setItem={setItem}
      validate={validate}
      menu={<SettingsMenu />}
      breadcrumbs={["settingsTitle", "sharedDevice"]}
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
                    onChange={(event) =>
                      setItem({ ...item, name: event.target.value })
                    }
                  />
                </Grid>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={2}>
                  {t("deviceImei")}
                </Grid>
                <Grid item xs={4}>
                  <OutlinedInput
                    fullWidth
                    size="small"
                    value={item.uniqueId || ""}
                    onChange={(event) =>
                      setItem({ ...item, uniqueId: event.target.value })
                    }
                    // helperText={t("deviceIdentifierHelp")}
                  />
                </Grid>
              </Stack>
            </Grid>
            {/* <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={1}>
                  {t("groupParent")}
                </Grid>
                <Grid item xs={4}>
                  <SelectField
                    fullWidth
                    value={item.groupId || 0}
                    onChange={(event) =>
                      setItem({ ...item, groupId: Number(event.target.value) })
                    }
                    endpoint="/api/groups"
                  />
                </Grid>
              </Stack>
            </Grid> */}
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={2}>
                  {t("simcardNumber")}
                </Grid>
                <Grid item xs={2}>
                  <OutlinedInput
                    fullWidth
                    size="small"
                    value={item.phone || ""}
                    onChange={(event) =>
                      setItem({ ...item, phone: event.target.value })
                    }
                  />
                </Grid>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={2}>
                  {t("gpsType")}
                </Grid>
                <Grid item xs={2}>
                  <OutlinedInput
                    fullWidth
                    size="small"
                    value={item.model || ""}
                    onChange={(event) =>
                      setItem({ ...item, model: event.target.value })
                    }
                  />
                </Grid>
              </Stack>
            </Grid>
            {/* <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={1}>
                  {t("deviceContact")}
                </Grid>
                <Grid item xs={2}>
                  <OutlinedInput
                    fullWidth
                    size="small"
                    value={item.contact || ""}
                    onChange={(event) =>
                      setItem({ ...item, contact: event.target.value })
                    }
                  />
                </Grid>
              </Stack>
            </Grid> */}
            {/* <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={1}>
                  {t("deviceCategory")}
                </Grid>
                <Grid item xs={4}>
                  <SelectField
                    fullWidth
                    value={item.category || "default"}
                    emptyValue={null}
                    onChange={(event) =>
                      setItem({ ...item, category: event.target.value })
                    }
                    data={deviceCategories.map((category) => ({
                      id: category,
                      name: t(
                        `category${category.replace(/^\w/, (c) =>
                          c.toUpperCase()
                        )}`
                      ),
                    }))}
                  />
                </Grid>
              </Stack>
            </Grid> */}
            {/* <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={1}>
                  {t("sharedCalendar")}
                </Grid>
                <Grid item xs={4}>
                  <SelectField
                    fullWidth
                    value={item.calendarId || 0}
                    onChange={(event) =>
                      setItem({
                        ...item,
                        calendarId: Number(event.target.value),
                      })
                    }
                    endpoint="/api/calendars"
                  />
                </Grid>
              </Stack>
            </Grid> */}
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
                      "2099-01-01"
                    }
                    onChange={(e) =>
                      setItem({
                        ...item,
                        expirationTime: dayjs(e.target.value, "YYYY-MM-DD")
                          .locale("en")
                          .format(),
                      })
                    }
                    disabled={!admin}
                  />
                </Grid>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Grid item xs={2}></Grid>
                <Grid item xs={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={item.disabled}
                        onChange={(event) =>
                          setItem({ ...item, disabled: event.target.checked })
                        }
                      />
                    }
                    label={t("sharedDisabled")}
                    disabled={!admin}
                  />
                </Grid>
              </Stack>
            </Grid>
          </Stack>
          {/* <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t("sharedRequired")}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                value={item.name || ""}
                onChange={(event) =>
                  setItem({ ...item, name: event.target.value })
                }
                label={t("sharedName")}
              />
              <TextField
                value={item.uniqueId || ""}
                onChange={(event) =>
                  setItem({ ...item, uniqueId: event.target.value })
                }
                label={t("deviceIdentifier")}
                helperText={t("deviceIdentifierHelp")}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t("sharedExtra")}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <SelectField
                value={item.groupId || 0}
                onChange={(event) =>
                  setItem({ ...item, groupId: Number(event.target.value) })
                }
                endpoint="/api/groups"
                label={t("groupParent")}
              />
              <TextField
                value={item.phone || ""}
                onChange={(event) =>
                  setItem({ ...item, phone: event.target.value })
                }
                label={t("sharedPhone")}
              />
              <TextField
                value={item.model || ""}
                onChange={(event) =>
                  setItem({ ...item, model: event.target.value })
                }
                label={t("deviceModel")}
              />
              <TextField
                value={item.contact || ""}
                onChange={(event) =>
                  setItem({ ...item, contact: event.target.value })
                }
                label={t("deviceContact")}
              />
              <SelectField
                value={item.category || "default"}
                emptyValue={null}
                onChange={(event) =>
                  setItem({ ...item, category: event.target.value })
                }
                data={deviceCategories.map((category) => ({
                  id: category,
                  name: t(
                    `category${category.replace(/^\w/, (c) => c.toUpperCase())}`
                  ),
                }))}
                label={t("deviceCategory")}
              />
              <SelectField
                value={item.calendarId || 0}
                onChange={(event) =>
                  setItem({ ...item, calendarId: Number(event.target.value) })
                }
                endpoint="/api/calendars"
                label={t("sharedCalendar")}
              />
              <TextField
                label={t("userExpirationTime")}
                type="date"
                value={
                  (item.expirationTime &&
                    dayjs(item.expirationTime)
                      .locale("en")
                      .format("YYYY-MM-DD")) ||
                  "2099-01-01"
                }
                onChange={(e) =>
                  setItem({
                    ...item,
                    expirationTime: dayjs(e.target.value, "YYYY-MM-DD")
                      .locale("en")
                      .format(),
                  })
                }
                disabled={!admin}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.disabled}
                    onChange={(event) =>
                      setItem({ ...item, disabled: event.target.checked })
                    }
                  />
                }
                label={t("sharedDisabled")}
                disabled={!admin}
              />
            </AccordionDetails>
          </Accordion>
          {item.id && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t("attributeDeviceImage")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <DropzoneArea
                  dropzoneText={t("sharedDropzoneText")}
                  acceptedFiles={["image/*"]}
                  filesLimit={1}
                  onChange={handleFiles}
                  showAlerts={false}
                />
              </AccordionDetails>
            </Accordion>
          )}
          <EditAttributesAccordion
            attributes={item.attributes}
            setAttributes={(attributes) => setItem({ ...item, attributes })}
            definitions={{ ...commonDeviceAttributes, ...deviceAttributes }}
          /> */}
        </>
      )}
    </EditDataView>
  );
};

export default DevicePage;
