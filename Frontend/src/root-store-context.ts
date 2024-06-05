import {createContext, useContext} from "react";
import RootStore from "./stores/root-store.tsx";

export const RootStoreContext = createContext<RootStore | null>(null)

export const useStores = () => {
    const context = useContext(RootStoreContext);

    if (!context) {
        throw new Error('Ошибка при получении стора')
    }

    return context;
}