import axios from "axios";
import { OrderType } from "../../context/types";

const url = 'http://localhost:3003/orderHistory';

export const getOrders = async (page: number) => 
    await axios.get(`${ url }?_page=${ page }&_limit=10`).then(res => res.data.reverse());

export const changeOrderStatus = async (mutateInfo: { newStatus: string, id: string }) =>
    await axios.patch(`${ url }/${ mutateInfo.id }`, { status: mutateInfo.newStatus });

export const handleSearch = async (text: string, setOrders: (data: any) => void) =>
    await axios.get(`${ url }?q=${ text }`)
        .then(res => setOrders(res.data.reverse()));

export const getUserOrders = async (userId: string, setOrdersHistory: (data: any) => void) => 
    await axios.get(`${ url }?userId=${ userId }`)
        .then(res => setOrdersHistory(res.data.reverse()));
    
export const createOrder = async (data: OrderType) => 
    await axios.post(url, data);

export const getShopOrders = async (shopId: string, page: number) => 
    await axios.get(`${ url }?q=${ shopId }&?_page=${ page }&_limit=10`).then(res => res.data.reverse());