import { Navigate, Outlet } from "react-router-dom";
import { FC, ReactNode } from "react";
import { useStores } from "../../stores/root-store-context.ts";
import { observer } from "mobx-react-lite";
import Spinner, { SpinnerTypes } from "../../shared/Spinner/Spinner.tsx";

interface ProtectedRouteProps {
  onlyForAuth: boolean;
  children?: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ onlyForAuth }) => {
  const { userStore } = useStores();

  if (!userStore.isReady) {
    return <Spinner type={SpinnerTypes.APP} />;
  }

  if (!userStore.user && onlyForAuth) {
    return <Navigate to="/login" />;
  }

  if (userStore.user && !onlyForAuth) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default observer(ProtectedRoute);
