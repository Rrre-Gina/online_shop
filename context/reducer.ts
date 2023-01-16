import axios from "axios";
import { ADD_PRODUCT, CLEAR_CART, LOGOUT, REMOVE_COUNT, SET_ID } from "./consts";
import { initialState } from "./context";
import { ActionProduct, ActionType, CartType } from "./types";

const getTotalSum = (cart: CartType[]) => {
    const getProducts = cart.flatMap(cat => cat.products);
    const totalSum = getProducts.map(prod => prod.prise * prod.amount).reduce((prev, curr) => prev + curr, 0);
    return totalSum;
}

const addProduct = (data: ActionProduct) => {
    return { 
        category: data.category, 
        categoryName: data.categoryName, 
        products: [
            {
                id: data.id,
                name: data.name,
                description: data.description,
                image: data.image,
                prise: data.prise,
                amount: data.amount,
                merchantId: data.merchantId,
                merchantName: data.merchantName
            }
        ] 
    }
}

export const reducer = (state = initialState, action: ActionType): any => {
    const category = action.payload ? state.cart.find(cat => cat.category === action.payload.category)! : null;

    switch (action.type) {
        case ADD_PRODUCT:
            const findCategory = (elem: CartType) => elem.category === action.payload.category;
            const findProducts = (elem: CartType) => elem.products.find(product => product.id === action.payload.id);
            
            if (state.cart.some(findCategory) && category) {
                if (state.cart.some(findProducts) ) {
                    category.products.find(product => product.id === action.payload.id)!.amount = action.payload.amount + 1;
                } 
                else {
                    category.products = [ ...category.products, {
                        id: action.payload.id,
                        name: action.payload.name,
                        description: action.payload.description,
                        image: action.payload.image,
                        prise: action.payload.prise,
                        amount: action.payload.amount,
                        merchantId: action.payload.merchantId,
                        merchantName: action.payload.merchantName
                    }]
                }
            } 
            else state.cart = [ ...state.cart, addProduct(action.payload) ];
            
            localStorage.setItem('cart', JSON.stringify(state.cart));
            return { ...state, cart: state.cart, totalSum: getTotalSum(state.cart) };

        case REMOVE_COUNT:
            if (category) {
                const product = category.products.find(product => product.id === action.payload.id)!
                if (action.payload.prodAmount === 1) {
                    category.products = [ ...category.products.filter(product => product.id !== action.payload.id) ];
    
                    if (!category.products.length) state.cart = [ 
                        ...state.cart.filter(cat => cat.category !== action.payload.category) 
                    ]
                }
                else product.amount = action.payload.prodAmount - 1;
            }
            
            localStorage.setItem('cart', JSON.stringify(state.cart));
            return { ...state, cart: state.cart, totalSum: getTotalSum(state.cart) };

        case SET_ID:
            localStorage.setItem('userId', action.payload.id);
            localStorage.setItem('userRole', action.payload.role);
            sessionStorage.setItem('userToken', action.payload.token);
            return { ...state, userToken: action.payload.token, userRole: action.payload.role };

        case CLEAR_CART: 
            localStorage.removeItem('cart');
            return { ...state, cart: [] };
        
        case LOGOUT: 
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
            sessionStorage.removeItem('userToken');
            localStorage.removeItem('cart');
            return { cart: [], userToken: '', totalSum: 0, userRole: '' };

        default:
            return state;
    }
}