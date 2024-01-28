import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffectAsync } from '../../reactHelper';
import { sessionActions } from '../../store';

export const nativeEnvironment = window.appInterface || (window.webkit && window.webkit.messageHandlers.appInterface);

export const nativePostMessage = (message) => {
  if (window.webkit && window.webkit.messageHandlers.appInterface) {
    window.webkit.messageHandlers.appInterface.postMessage(message);
  }
  if (window.appInterface) {
    window.appInterface.postMessage(message);
  }
};

export const handleLoginTokenListeners = new Set();
window.handleLoginToken = (token) => {
  handleLoginTokenListeners.forEach((listener) => listener(token));
};

const updateNotificationTokenListeners = new Set();
window.updateNotificationToken = (token) => {
  updateNotificationTokenListeners.forEach((listener) => listener(token));
};

const NativeInterface = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.session.user);
  const [notificationToken, setNotificationToken] = useState(null);

  useEffect(() => {
    const listener = (token) => setNotificationToken(token);
    updateNotificationTokenListeners.add(listener);
    return () => updateNotificationTokenListeners.delete(listener);
  }, [setNotificationToken]);

  useEffectAsync(async () => {
    if (user && !user.readonly && notificationToken) {
      window.localStorage.setItem('notificationToken', notificationToken);
      setNotificationToken(null);

      const tokens = user.attributes.notificationTokens?.split(',') || [];
      if (!tokens.includes(notificationToken)) {
        const updatedUser = {
          ...user,
          attributes: {
            ...user.attributes,
            notificationTokens: [...tokens.slice(-2), notificationToken].join(','),
          },
        };

        const response = await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
          dispatch(sessionActions.updateUser(await response.json()));
        } else {
          throw Error(await response.text());
        }
      }
    }
  }, [user, notificationToken, setNotificationToken]);

  return null;
};

export default NativeInterface;
