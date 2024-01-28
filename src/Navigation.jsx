import React, { useState, lazy } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LinearProgress } from "@mui/material";
import MainPage from "./main/MainPage";
import CombinedReportPage from "./reports/CombinedReportPage";
import RouteReportPage from "./reports/RouteReportPage";
import ServerPage from "./settings/ServerPage";
import UserPage from "./pages/UserPage";
import DevicePage from "./pages/DevicePage";
import UsersPage from "./pages/UsersPage";
import NotificationsPage from "./settings/NotificationsPage";
import NotificationPage from "./settings/NotificationPage";
import GroupsPage from "./settings/GroupsPage";
import GroupPage from "./settings/GroupPage";
import PositionPage from "./other/PositionPage";
import NetworkPage from "./other/NetworkPage";
import EventReportPage from "./reports/EventReportPage";
import ReplayPage from "./other/ReplayPage";
import TripReportPage from "./reports/TripReportPage";
import StopReportPage from "./reports/StopReportPage";
import SummaryReportPage from "./reports/SummaryReportPage";
import ChartReportPage from "./reports/ChartReportPage";
import DriversPage from "./settings/DriversPage";
import DriverPage from "./settings/DriverPage";
import CalendarsPage from "./settings/CalendarsPage";
import CalendarPage from "./settings/CalendarPage";
import ComputedAttributesPage from "./settings/ComputedAttributesPage";
import ComputedAttributePage from "./settings/ComputedAttributePage";
import MaintenancesPage from "./settings/MaintenancesPage";
import MaintenancePage from "./settings/MaintenancePage";
import CommandsPage from "./settings/CommandsPage";
import CommandPage from "./settings/CommandPage";
import StatisticsPage from "./reports/StatisticsPage";
import LoginPage from "./login/LoginPage";
import RegisterPage from "./login/RegisterPage";
import ResetPasswordPage from "./login/ResetPasswordPage";
import GeofencesPage from "./other/GeofencesPage";
import GeofencePage from "./settings/GeofencePage";
import useQuery from "./common/util/useQuery";
import { useEffectAsync } from "./reactHelper";
import { devicesActions } from "./store";
import EventPage from "./other/EventPage";
import PreferencesPage from "./settings/PreferencesPage";
import AccumulatorsPage from "./settings/AccumulatorsPage";
import CommandDevicePage from "./settings/CommandDevicePage";
import CommandGroupPage from "./settings/CommandGroupPage";
import App from "./App";
import ChangeServerPage from "./login/ChangeServerPage";
import DevicesPage from "./pages/DevicesPage";
import ScheduledPage from "./reports/ScheduledPage";
import DeviceConnectionsPage from "./settings/DeviceConnectionsPage";
import GroupConnectionsPage from "./settings/GroupConnectionsPage";
import UserConnectionsPage from "./settings/UserConnectionsPage";
import DeviceForwardsPage from "./pages/DeviceForwardsPage";
import DeviceForwardPage from "./pages/DeviceForwardPage";
import DeviceCommandsPage from "./pages/DeviceCommandsPage";
import DeviceCommandPage from "./pages/DeviceCommandPage";
import DashboardPage from "./pages/DashboardPage";
import UserDevicesPage from "./pages/UserDevicesPage";
// import AuthLogin from "./pages/auth/AuthLogin";
import Loadable from "./common/components/mantis/Loadable";
import MinimalLayout from "./layout/MinimalLayout";
import MainLayout from "./layout/MainLayout";

import DataTablePage from "./pages/DataTablePage";
import DeviceSupportedsPage from "./pages/DeviceSupportedsPage";
import DeviceSupportedPage from "./pages/DeviceSupportedPage";

const Navigation = () => {
  const AuthLogin = Loadable(lazy(() => import("./pages/auth/Login")));
  const AuthRegister = Loadable(lazy(() => import("./pages/auth/Register")));
  const VerificationPage = Loadable(
    lazy(() => import("./pages/auth/VerificationPage"))
  );

  const RegistrationVerifyPage = Loadable(
    lazy(() => import("./pages/auth/RegistrationVerifyPage"))
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [redirectsHandled, setRedirectsHandled] = useState(false);

  const { pathname } = useLocation();
  const query = useQuery();

  useEffectAsync(async () => {
    if (query.get("token")) {
      const token = query.get("token");
      await fetch(`/api/session?token=${encodeURIComponent(token)}`);
      navigate(pathname);
    } else if (query.get("deviceId")) {
      const deviceId = query.get("deviceId");
      const response = await fetch(`/api/devices?uniqueId=${deviceId}`);
      if (response.ok) {
        const items = await response.json();
        if (items.length > 0) {
          dispatch(devicesActions.selectId(items[0].id));
        }
      } else {
        throw Error(await response.text());
      }
      navigate("/");
    } else if (query.get("eventId")) {
      const eventId = parseInt(query.get("eventId"), 10);
      navigate(`/event/${eventId}`);
    } else {
      setRedirectsHandled(true);
    }
  }, [query]);

  if (!redirectsHandled) {
    return <LinearProgress />;
  }
  return (
    // <MainLayout>
    <Routes>
      <Route path="/login" element={<AuthLogin />} />
      <Route path="/register" element={<AuthRegister />} />
      <Route path="/email-verify" element={<VerificationPage />} />
      <Route path="/registration-verify" element={<RegistrationVerifyPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/change-server" element={<ChangeServerPage />} />

      <Route path="/" element={<App />}>
        {/* <Route index element={<MainPage />} /> */}
        <Route index element={<DevicesPage />} />
        <Route path="/test/table" Component={DataTablePage} />
        <Route path="devices/add" element={<DevicePage />} />
        <Route path="devices/edit/:id" element={<DevicePage />} />
        <Route path="device/:id" element={<DevicePage />} />
        <Route path="device/:id/forwards" element={<DeviceForwardsPage />} />
        <Route path="device/:id/forward" element={<DeviceForwardPage />} />
        <Route path="device/:id/forward/:fid" element={<DeviceForwardPage />} />
        <Route path="device/:id/commands" element={<DeviceCommandsPage />} />
        <Route path="device/:id/command" element={<DeviceCommandPage />} />
        <Route path="devices" element={<DevicesPage />} />
        <Route path="devices/supported" element={<DeviceSupportedsPage />} />
        <Route path="devices/supported/add" element={<DeviceSupportedPage />} />
        <Route
          path="devices/supported/edit/:id"
          element={<DeviceSupportedPage />}
        />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/add" element={<UserPage />} />
        <Route path="users/edit/:id" element={<UserPage />} />
        <Route path="users/:userId/devices" element={<UserDevicesPage />} />
        <Route path="position/:id" element={<PositionPage />} />
        <Route path="network/:positionId" element={<NetworkPage />} />
        <Route path="event/:id" element={<EventPage />} />
        <Route path="replay" element={<ReplayPage />} />
        <Route path="geofences" element={<GeofencesPage />} />
        <Route path="settings">
          <Route path="accumulators/:deviceId" element={<AccumulatorsPage />} />
          <Route path="calendars" element={<CalendarsPage />} />
          <Route path="calendar/:id" element={<CalendarPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="commands" element={<CommandsPage />} />
          <Route path="command/:id" element={<CommandPage />} />
          <Route path="command" element={<CommandPage />} />
          <Route path="attributes" element={<ComputedAttributesPage />} />
          <Route path="attribute/:id" element={<ComputedAttributePage />} />
          <Route path="attribute" element={<ComputedAttributePage />} />
          <Route path="devices" element={<DevicesPage />} />
          <Route
            path="device/:id/connections"
            element={<DeviceConnectionsPage />}
          />

          {/* <Route path="device/:id/forward" element={<DeviceForwardPage />} /> */}
          <Route path="device/:id/command" element={<CommandDevicePage />} />
          <Route path="device/:id" element={<DevicePage />} />
          <Route path="device" element={<DevicePage />} />
          <Route path="drivers" element={<DriversPage />} />
          <Route path="driver/:id" element={<DriverPage />} />
          <Route path="driver" element={<DriverPage />} />
          <Route path="geofence/:id" element={<GeofencePage />} />
          <Route path="geofence" element={<GeofencePage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route
            path="group/:id/connections"
            element={<GroupConnectionsPage />}
          />
          <Route path="group/:id/command" element={<CommandGroupPage />} />
          <Route path="group/:id" element={<GroupPage />} />
          <Route path="group" element={<GroupPage />} />
          <Route path="maintenances" element={<MaintenancesPage />} />
          <Route path="maintenance/:id" element={<MaintenancePage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="notification/:id" element={<NotificationPage />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="preferences" element={<PreferencesPage />} />
          <Route path="server" element={<ServerPage />} />
          {/* <Route path="users" element={<UsersPage />} /> */}
          <Route
            path="user/:id/connections"
            element={<UserConnectionsPage />}
          />
          {/* <Route path="user/:id" element={<UserPage />} /> */}
          {/* <Route path="user" element={<UserPage />} /> */}
        </Route>
        <Route path="reports">
          <Route path="combined" element={<CombinedReportPage />} />
          <Route path="chart" element={<ChartReportPage />} />
          <Route path="event" element={<EventReportPage />} />
          <Route path="route" element={<RouteReportPage />} />
          <Route path="stop" element={<StopReportPage />} />
          <Route path="summary" element={<SummaryReportPage />} />
          <Route path="trip" element={<TripReportPage />} />
          <Route path="scheduled" element={<ScheduledPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
        </Route>
      </Route>
    </Routes>
    // </MainLayout>
  );
};

export default Navigation;
