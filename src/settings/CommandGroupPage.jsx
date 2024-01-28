import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  TextField,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';
import { useCatch } from '../reactHelper';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  buttons: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-evenly',
    '& > *': {
      flexBasis: '33%',
    },
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
}));

const CommandDevicePage = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const t = useTranslation();

  const { id } = useParams();

  const textEnabled = useSelector((state) => state.session.server.textEnabled);

  const [item, setItem] = useState({ type: 'custom', attributes: {} });

  const handleSend = useCatch(async () => {
    const query = new URLSearchParams({ groupId: id });
    const response = await fetch(`/api/commands/send?${query.toString()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      navigate(-1);
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'deviceCommand']}>
      <Container maxWidth="xs" className={classes.container}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('sharedRequired')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <FormControl fullWidth>
              <InputLabel>{t('sharedType')}</InputLabel>
              <Select label={t('sharedType')} value="custom" disabled>
                <MenuItem value="custom">{t('commandCustom')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              value={item.attributes.data}
              onChange={(e) => setItem({ ...item, attributes: { ...item.attributes, data: e.target.value } })}
              label={t('commandData')}
            />
            {textEnabled && (
              <FormControlLabel
                control={<Checkbox checked={item.textChannel} onChange={(event) => setItem({ ...item, textChannel: event.target.checked })} />}
                label={t('commandSendSms')}
              />
            )}
          </AccordionDetails>
        </Accordion>
        <div className={classes.buttons}>
          <Button
            type="button"
            color="primary"
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            {t('sharedCancel')}
          </Button>
          <Button
            type="button"
            color="primary"
            variant="contained"
            onClick={handleSend}
            disabled={!item.attributes.data}
          >
            {t('commandSend')}
          </Button>
        </div>
      </Container>
    </PageLayout>
  );
};

export default CommandDevicePage;
