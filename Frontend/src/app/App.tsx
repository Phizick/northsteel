import "./styles/index.scss";
import { observer } from "mobx-react-lite";
import AppRouter from "./providers/RouterProvider/AppRouter.tsx";
import { useCookies } from "react-cookie";
import { Suspense, useEffect } from "react";
import { useStores } from "../stores/root-store-context.ts";
import Spinner, { SpinnerTypes } from "../shared/Spinner/Spinner.tsx";
import { runInAction } from "mobx";

function App() {
  const [cookies] = useCookies(["user_id"]);

  const { userStore } = useStores();

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
      </Suspense>
    </div>
  );
}

export default observer(App);
