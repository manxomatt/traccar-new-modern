import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  title: {
    name: t('serverName'),
    type: 'string',
  },
  description: {
    name: t('serverDescription'),
    type: 'string',
  },
  logo: {
    name: t('serverLogo'),
    type: 'string',
  },
  logoInverted: {
    name: t('serverLogoInverted'),
    type: 'string',
  },
  colorPrimary: {
    name: t('serverColorPrimary'),
    type: 'string',
    subtype: 'color',
  },
  colorSecondary: {
    name: t('serverColorSecondary'),
    type: 'string',
    subtype: 'color',
  },
  disableChange: {
    name: t('serverChangeDisable'),
    type: 'boolean',
  },
  darkMode: {
    name: t('settingsDarkMode'),
    type: 'boolean',
  },
  totpEnable: {
    name: t('settingsTotpEnable'),
    type: 'boolean',
  },
  totpForce: {
    name: t('settingsTotpForce'),
    type: 'boolean',
  },
  serviceWorkerUpdateInterval: {
    name: t('settingsServiceWorkerUpdateInterval'),
    type: 'number',
  },
  'ui.disableLoginLanguage': {
    name: t('attributeUiDisableLoginLanguage'),
    type: 'boolean',
  },
}), [t]);
