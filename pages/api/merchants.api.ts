import axios from "axios";
import { ShopType } from "../../context/types";

const url = 'http://localhost:3003/merchants';

export const deleteUserFromShop = async (id: string) => {
    const deleteFrom = await axios.get(`${ url }?q=${ id }`)
    const index = deleteFrom.data[0].merchantUsers.indexOf(id);
    if (index !== -1) {
        deleteFrom.data[0].merchantUsers.splice(index, 1)
    }
    await axios.put(`${ url }/${ deleteFrom.data[0].id }`, { 
        merchantUsers: deleteFrom.data[0].merchantUsers,
        merchantName: deleteFrom.data[0].merchantName
    })
};

export const addUserToShop = async (id: string, shop: string) => {
    const addTo = await axios.get(`${ url }/${ shop }`)
    addTo.data.merchantUsers.push(id)
    await axios.put(`${ url }/${ shop }`, { 
        merchantUsers: addTo.data.merchantUsers,
        merchantName: addTo.data.merchantName 
    })
};

export const getShopsInForm = async (setState: (data: any) => void) =>
    await axios.get(url).then(res => setState(res.data));

export const getUserShop = async (setState: (data: any) => void, role: string, id: string) => {
    if (role === 'manager') await axios.get(`${ url }?q=${ id }`).then(res => setState(res.data[0].id))
    else await axios.get(url).then(res => setState(res.data[0].id));
} 

export const getShops = async (page: number) =>
    await axios.get(`${ url }?_page=${ page }&_limit=10`).then(res => res.data.reverse());

export const createShop = async (shop: ShopType) =>
    await axios.post(url, shop);

export const editShop = async (data: { id: string, name: string }) =>
    await axios.patch(`${ url }/${ data.id }`, { merchantName: data.name });

export const getShopName = async (setState: (data: any) => void, userId: string) => {
    await axios.get(`${ url }?q=${ userId }`).then(res => setState(res.data[0].merchantName));
} 

export const getShopInfo = async (setState: (data: any) => void, id: string) => {
    await axios.get(`${ url }?q=${ id }`).then(res => setState(res.data[0]));
} 