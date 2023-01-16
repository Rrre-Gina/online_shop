import { useEffect, useState } from "react";
import HeaderAdmin from "../../components/headerAdmin";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Link from "next/link";
import Loader from "../../components/loader";
import { ProductType } from "../../context/types";
import Pagination from "../../components/pagination";
import { getProducts, handleSearch, removeProduct } from "../api/products.api";
import AddProductForm from "../../components/addProductForm";
import EditProductModal from "../../components/editProductModal";
import { useStoreContext } from "../../context/context";
import AccessError from "../../components/accessError";

const Products = () => {
    const queryClient = useQueryClient();
    const [addForm, setAddForm] = useState(false);
    const [update, setUpdate] = useState(false);
    const [productToUpdate, setProductToUpdate] = useState({ 
        id: 0, 
        name: '', 
        description: '', 
        category: 0, 
        categoryName: '', 
        prise: 0, 
        image: '', 
        merchantId: [''],
        merchantName: [''],
    });
    const [page, setPage] = useState(1);
    const [productInfo, setProductInfo] = useState([{}]);
    const { state } = useStoreContext();
    const [userAccess, setUserAccess] = useState({ token: '', role: '' });
    const [products, setProducts] = useState([]);

    useEffect(() => setUserAccess({ token: state.userToken, role: state.userRole }), [state]);

    typeof document !== 'undefined' ? document.body.classList.remove('scroll_block') : null;

    const { isLoading, error, data } = useQuery(
        ["products", page],
        () => getProducts(page),
        {
            keepPreviousData: true,
        }
    );

    useEffect(() => { data ? setProducts(data) : null }, [data])

    const deleteProduct = useMutation((id: number) => removeProduct(id));
    
    const mutation = async (id: number) => {
        await deleteProduct.mutateAsync(id);
        queryClient.invalidateQueries('products')
    }

    const toggleFunction = (id: any) => setProductInfo({ ...productInfo, [id]: !productInfo[id] });

    return (
        <>
            {
                !userAccess.token?.length || userAccess.role !== 'admin'
                ?   <AccessError />
                :   <>
                    <HeaderAdmin />
                    {
                        error
                        ?   <p className="need-auth">
                                { 'Ошибка ' + error } 
                                <br/> 
                                <Link href='/admin'>Вернуться на главную</Link> 
                            </p>
                        :   <main>
                                <h3 className="page-title">Справочники / Товары </h3>

                                <input 
                                    type='text' 
                                    className="form-elem action-field" 
                                    onChange={ (e) => handleSearch(e.currentTarget.value, setProducts) } 
                                    placeholder='Поиск по товарам'
                                    role='searchField'
                                />
                                
                                <h4 
                                    className="form-opening"
                                    onClick={ () => setAddForm(!addForm) }>
                                        Добавить товар { addForm ? <span>&#11165;</span> : <span>&#11167;</span> } 
                                </h4>

                                {
                                    addForm
                                    ?   <AddProductForm closeForm={ () => setAddForm(false) }/>
                                    :   null
                                }
                                
                                <div>
                                    {
                                        isLoading
                                        ?   <div className="section-title">
                                                <Loader/>
                                            </div>
                                        :   <ul>
                                                { 
                                                    products.map((product: ProductType) => 
                                                        <li key={ product.id } className='border'> 
                                                            <div className="list cursor" onClick={ () => toggleFunction(product.id) }>
                                                                <span className="list__titles">{ product.name }</span> 
                                                                <span className="list__titles">{ product.categoryName }</span> 
                                                                <div>
                                                                    <button 
                                                                        className="list__btn-icon"
                                                                        onClick={ () => { 
                                                                            setUpdate(true) 
                                                                            setProductToUpdate(product) }
                                                                        }> 
                                                                            &#9998; 
                                                                    </button> 
                                                                    <button 
                                                                        className="list__btn-icon bold"
                                                                        onClick={ () => mutation(product.id) }> 
                                                                            &#128465; 
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className={ productInfo[product.id] ? 'detail-info' : 'hide' }>
                                                                <span className="title product__title">Информация о товаре</span>
                                                                <div className="product_row">
                                                                <div className="product__img detail-info__img order-list__products" style={{ backgroundImage: 'url(' + product.image + ')', }}></div>
                                                                    <div 
                                                                        className="order-list__products product__info max-width" 
                                                                        key={ product.id }
                                                                    >
                                                                        <p>
                                                                            <span className="product__title order-title">
                                                                                Название: 
                                                                            </span>
                                                                            { product.name }
                                                                        </p>
                                                                        <p>
                                                                            <span className="product__title order-title">
                                                                                Категория: 
                                                                            </span>
                                                                            { product.categoryName }
                                                                        </p>
                                                                        <p>
                                                                            <span className="product__title order-title">Магазины:</span> 
                                                                            { product.merchantName && product.merchantName.join(' | ') }
                                                                        </p>
                                                                        <p>
                                                                            <span className="product__title order-title">
                                                                                Цена: 
                                                                            </span>
                                                                            { product.prise }
                                                                        </p>
                                                                        <p>
                                                                            <span className="product__title order-title">
                                                                                Описание: 
                                                                            </span>
                                                                            { product.description }
                                                                        </p>
                                                                    </div> 
                                                                </div>
                                                                
                                                            </div>
                                                        </li>    
                                                    )
                                                }
                                            </ul>
                                    }
                                </div>
                                <Pagination 
                                    page={ page } 
                                    length={ data && data.length } 
                                    prevPage = { () => setPage(page - 1) }
                                    nextPage = { () => setPage(page + 1) }
                                />
                                { 
                                    update 
                                    ?   <EditProductModal closeModal={ () => setUpdate(false) } product={ productToUpdate } />
                                    :   null
                                }
                            </main>
                    }
                    </>
            }
        </>
    )
}
export default Products