import "./styles/index.scss";
import { observer } from "mobx-react-lite";
import AppRouter from "./providers/RouterProvider/AppRouter.tsx";
import { useCookies } from "react-cookie";
import { Suspense, useEffect } from "react";
import { useStores } from "../stores/root-store-context.ts";
import Spinner, { SpinnerTypes } from "../shared/Spinner/Spinner.tsx";
import { runInAction } from "mobx";
import { Snackbar, SnackbarContent } from "@mui/material";

function App() {
  const [cookies] = useCookies(["user_id"]);

  const { userStore, notificationsStore } = useStores();

  useEffect(() => {
    (async () => {
      if (cookies.user_id) {
        await userStore.getUser(cookies.user_id);
      }
      runInAction(() => {
        userStore.isReady = true;
      });
    })();
  }, []);

  return (
    <div className="app">
      <Suspense fallback={<Spinner type={SpinnerTypes.APP} />}>
        <AppRouter />
        {notificationsStore.notification && (
          <Snackbar
            color="red"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={!!notificationsStore.notification}
          >
            <SnackbarContent
              style={{
                backgroundColor:
                  notificationsStore.notification.type === "success"
                    ? "#AFEEEE"
                    : "#F8F2F2",
                color:
                  notificationsStore.notification.type === "success"
                    ? "#006400"
                    : "#9C1C1C",
              }}
              message={notificationsStore.notification.message}
            />
          </Snackbar>
        )}
      </Suspense>
    </div>
  );
}

export default observer(App);
