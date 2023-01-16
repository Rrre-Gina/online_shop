import { ADD_PRODUCT, LOGOUT, SET_ID, CLEAR_CART, REMOVE_COUNT } from "./consts" 

export const addProduct = (product: {}) => ({
    type: ADD_PRODUCT,
    payload: product
})

export const removeCount = (product: {id: number, category: number, prodAmount: number}) => ({
    type: REMOVE_COUNT,
    payload: product
})

export const clearCart = () => ({
    type: CLEAR_CART
})

export const setUserInfo = (userInfo: { id: string, token: string, role: string }) => ({
    type: SET_ID,
    payload: userInfo
})

export const logout = () => ({
    type: LOGOUT
})
