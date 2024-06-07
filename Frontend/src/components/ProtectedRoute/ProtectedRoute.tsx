import { Navigate } from "react-router-dom";
import { FC, ReactNode } from "react";
import { useStores } from "../../stores/root-store-context.ts";
import { observer } from "mobx-react-lite";

interface ProtectedRouteProps {
  onlyForAuth: boolean;
  children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ onlyForAuth, children }) => {
  const { userStore } = useStores();

  console.log(userStore);

  if (!userStore.user && onlyForAuth) {
    return <Navigate to="/login" />;
  }

  if (userStore.user && !onlyForAuth) {
    return <Navigate to="/onboarding" />;
  }

  return children;
};

export default observer(ProtectedRoute);
