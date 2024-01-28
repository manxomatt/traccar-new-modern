import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import {
  Container,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Skeleton,
  Typography,
  TextField,
  Stack,
  Grid,
} from "@mui/material";
import { useCatch, useEffectAsync } from "../../reactHelper";
import { useTranslation } from "../../common/components/LocalizationProvider";
import PageLayout from "../../common/components/PageLayout";
import MainCard from "../../common/components/mantis/MainCard";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  buttons: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "flex",
    justifyContent: "space-evenly",
    "& > *": {
      flexBasis: "33%",
    },
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
}));

const EditDataView = ({
  children,
  endpoint,
  item,
  setItem,
  defaultItem,
  validate,
  onItemSaved,
  menu,
  breadcrumbs,
  cardTitle,
}) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const t = useTranslation();

  const { id } = useParams();

  useEffectAsync(async () => {
    if (!item) {
      if (id) {
        const response = await fetch(`/api/${endpoint}/${id}`);
        if (response.ok) {
          setItem(await response.json());
        } else {
          throw Error(await response.text());
        }
      } else {
        setItem(defaultItem || {});
      }
    }
  }, [id, item, defaultItem]);

  const handleSave = useCatch(async () => {
    let url = `/api/${endpoint}`;
    if (id) {
      url += `/${id}`;
    }

    const response = await fetch(url, {
      method: !id ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      if (onItemSaved) {
        onItemSaved(await response.json());
      }
      navigate(-1);
    } else {
      throw Error(await response.text());
    }
  });

  return (
    // <PageLayout menu={menu} breadcrumbs={breadcrumbs}>
    <Grid container spacing={3}>
      <Grid item xs={12} lg={12}>
        <Stack spacing={2}>
          <MainCard title={cardTitle}>
            {item ? (
              children
            ) : (
              <Stack spacing={2}>
                <Grid item xs={12}></Grid>
              </Stack>
            )}
            <Stack spacing={2}>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" spacing={0}>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={4}>
                    <div className={classes.buttons}>
                      <Button
                        type="button"
                        color="primary"
                        variant="outlined"
                        onClick={() => navigate(-1)}
                        disabled={!item}
                        xs={1}
                      >
                        {t("sharedCancel")}
                      </Button>
                      <Button
                        type="button"
                        color="primary"
                        variant="contained"
                        onClick={handleSave}
                        disabled={!item || !validate()}
                      >
                        {t("sharedSave")}
                      </Button>
                    </div>
                  </Grid>
                </Stack>
              </Grid>
            </Stack>
            {/*  */}
          </MainCard>
        </Stack>
      </Grid>
    </Grid>
    // <Container maxWidth="xs" className={classes.container}>
    //   {item ? (
    //     children
    //   ) : (
    //     <Accordion defaultExpanded>
    //       <AccordionSummary>
    //         <Typography variant="subtitle1">
    //           <Skeleton width="10em" />
    //         </Typography>
    //       </AccordionSummary>
    //       <AccordionDetails>
    //         {[...Array(3)].map((_, i) => (
    //           <Skeleton key={-i} width="100%">
    //             <TextField />
    //           </Skeleton>
    //         ))}
    //       </AccordionDetails>
    //     </Accordion>
    //   )}
    //   <div className={classes.buttons}>
    //     <Button
    //       type="button"
    //       color="primary"
    //       variant="outlined"
    //       onClick={() => navigate(-1)}
    //       disabled={!item}
    //     >
    //       {t("sharedCancel")}
    //     </Button>
    //     <Button
    //       type="button"
    //       color="primary"
    //       variant="contained"
    //       onClick={handleSave}
    //       disabled={!item || !validate()}
    //     >
    //       {t("sharedSave")}
    //     </Button>
    //   </div>
    // </Container>
    // </PageLayout>
  );
};

export default EditDataView;
