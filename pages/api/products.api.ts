import axios from "axios";
import { ProductType } from "../../context/types";

const url = 'http://localhost:3003/products'

export const getProducts = async (page: number) => 
    await axios.get(`${ url }?_page=${ page }&_limit=10`).then(res => res.data.reverse());

export const createProduct = async (product: ProductType) => 
    await axios.post(url, product);

export const removeProduct = async (id: number) => 
    await axios.delete(`${ url }/${ id }`);

export const editProduct = async (data: ProductType) => 
    await axios.patch(`${ url }/${ data.id }`, data);

export const getProductsList = async (categoryId: string) => 
    await axios.get(`${ url }?category=${ categoryId }`).then(res => res.data);

export const getProductInfo = async (id: string) => 
    await axios.get(`${ url }/${ id }`).then(res => res.data);

export const getShopProducts = async (id: string, page: number) =>
    await axios.get(`${ url }?merchantId=${ id }&?_page=${ page }&_limit=10`).then(res => res.data.reverse());

export const handleSearch = async (text: string, setProducts: (data: any) => void) =>
    await axios.get(`${ url }?q=${ text }`)
        .then(res => setProducts(res.data.reverse()));