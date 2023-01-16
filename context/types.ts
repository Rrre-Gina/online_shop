import { Dispatch, ReactNode } from "react";


export type Props = {
    children: ReactNode;
};

export type ActionType = {
    type: string;
    payload?: any;
};

export type ContextType = {
    state: InitialStateType;
    dispatch: Dispatch<ActionType>;
};

export type ProductType = { 
    category: number, 
    categoryName: string, 
    id: number, 
    name: string, 
    description: string, 
    image: string, 
    prise: any, 
    merchantId: string[],
    merchantName: string[]
}

export type ActionProduct = { 
    category: number, 
    categoryName: string, 
    id: number, 
    name: string, 
    description: string, 
    image: string, 
    prise: number, 
    amount: number;
    merchantId: string[],
    merchantName: string[]
}

export type CartProduct = {
    id: number,
    name: string,
    description: string,
    image: string,
    prise: number,
    amount: number,
    merchantId: string[],
    merchantName: string[]
}

export type CartType = {
    category: number,
    categoryName: string,
    products: CartProduct[]
}

export type InitialStateType = {
    cart: CartType[],
    userToken: string,
    userRole: string,
    totalSum: number
}

export type OrderProps = {
    closeModal: () => void;
    productsInfo: { 
        id: number, 
        amount: number, 
        name: string, 
        prise: number, 
        merchantId: string[],
        merchantName: string[] 
    }[];
    sum: number
};

export type UserType = {
    id: string,
    name: string,
    email: string,
    password: string,
    role: string,
}

export type OrderType = {
    id: any,
    date: string,
    address: string,
    phone: string,
    sum: number,
    pay: string,
    status: string,
    orderProducts: OrderProducts,
    userId: string
}

export type OrderProducts = { 
    id: any, 
    name: string, 
    prise: number, 
    amount: number,
    merchantId: string[],
    merchantName: string[] 
}[]

export type EditModalProps = {
    closeModal: () => void,
    userInfo: { 
        id: string,
        name: string, 
        email: string,
        role: string 
    },
    fetchUserInfo: () => void
}

export type OrderModalProps = {
    closeModal: () => void,
    productsInfo: OrderProducts,
    sum: number
};

export type CategoryType = {
    id: number,
    name: string
}

export type ShopType = { 
    id: string, 
    merchantName: string, 
    merchantUsers: string[] 
}

export type EditCategoryProps = {
    closeModal: () => void,
    category: CategoryType
}

export type EditShopProps = {
    closeModal: () => void,
    shop: ShopType
}

export type EditUserProps = {
    closeModal: () => void,
    user: UserType
}

export type EditProductProps = {
    closeModal: () => void,
    product: ProductType
}

export type CloseFormType = {
    closeForm: () => void
}

export type EditStatusProps = {
    closeModal: () => void,
    status: string,
    id: string,
}
