import "./styles/index.scss"
import {observer} from "mobx-react-lite";
import {useEffect} from "react";
import {useStores} from "../root-store-context.ts";
import AppRouter from "./providers/RouterProvider/AppRouter.tsx";

function App() {

    const {user} = useStores()

    useEffect(() => {
        user.getUser()
    }, [])

  return (
         <div className="app">
             <AppRouter/>
         </div>
  )
}

export default observer(App)
