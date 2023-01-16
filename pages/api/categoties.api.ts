import axios from "axios";
import { CategoryType } from "../../context/types";

const url = 'http://localhost:3003/categories';

export const getCategory = async (page: number) => 
    await axios.get(`${ url }?_page=${ page }&_limit=10`).then(res => res.data.reverse());

export const createCategory = async (category: CategoryType) => 
    await axios.post(url, category);

export const removeCategory = async (id: number) => 
    await axios.delete(`${ url }/${ id }`);

export const getCategories = async () => 
    await axios.get(url).then(res => res.data);

export const getCategoriesInForm = async (setState: (data: any) => void) => 
    await axios.get(url).then(res => setState(res.data));

export const handleSearch = async (text: string, setCategories: (data: any) => void) =>
    await axios.get(`${ url }?q=${ text }`)
        .then(res => setCategories(res.data));

export const editCategory = async (data: { id: number, name: string }) => 
    await axios.patch(`${ url }/${ data.id }`, data);