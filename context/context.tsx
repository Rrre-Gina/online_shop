import { createContext, useContext, useReducer } from "react";
import { reducer } from "./reducer";
import { ActionType, ContextType, InitialStateType, Props } from "./types";

const localCart = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart')!) : [];
const localToken = typeof window !== 'undefined' ? sessionStorage.getItem('userToken')! : '';
const localUserRole = typeof window !== 'undefined' ? localStorage.getItem('userRole')! : '';

export const initialState: InitialStateType = {
    cart: localCart ? localCart : [],
    userToken: localToken,
    totalSum: 0,
    userRole: localUserRole,
}

export const Store = createContext<{ state: InitialStateType; dispatch: React.Dispatch<ActionType> }>({
    state: initialState,
    dispatch: () => null
});

export const StoreProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <Store.Provider value={{ state, dispatch }}>
            { children }
        </Store.Provider>
    )
} 

export const useStoreContext = () => useContext<ContextType>(Store);
