import "./styles/index.scss";
import { observer } from "mobx-react-lite";
import AppRouter from "./providers/RouterProvider/AppRouter.tsx";
import { useCookies } from "react-cookie";
import { Suspense, useEffect } from "react";
import { useStores } from "../stores/root-store-context.ts";

function App() {
  const [cookies] = useCookies(["user_id"]);

  const { userStore } = useStores();

  useEffect(() => {
    (async () => {
      if (cookies.user_id) {
        await userStore.getUser(cookies.user_id);
      }
    })();
  }, [cookies.user_id]);

  return (
    <div className="app">
      <Suspense fallback={<div>Загрузка...</div>}>
        <AppRouter />
      </Suspense>
    </div>
  );
}

export default observer(App);
