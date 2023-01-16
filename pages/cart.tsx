import React, { useEffect, useState } from "react";
import { addProduct, removeCount } from "../context/actions";
import OrderModal from "../components/orderModal";
import { useStoreContext } from "../context/context";
import { CartProduct, CartType } from "../context/types";
import Header from "../components/header";
import Link from "next/link";

const ShoppingCart = () => {
    const [openModal, setOpenModal] = useState(false);
    const { state, dispatch } = useStoreContext();
    const [userToken, setUserToken] = useState('');

    useEffect(() => setUserToken(state.userToken), []);

    const handleAdd = (item: CartProduct, category: CartType) => {
        const product = { ...item, category: category.category, categoryName: category.categoryName };
        dispatch(addProduct(product));
    };

    
    return (
        <>
            <Header />
            <div>
            { 
                !userToken
                ?   <main> 
                        <p className="need-auth">
                            Для перехода в корзину необходимо <Link href='/auth'>авторизоваться</Link> 
                        </p>
                    </main>
                :   <main>
                    { 
                        state.cart.length 
                        ?   <div className="product">
                                <div className="space-between">
                                    <h2>Выбранные товары</h2>
                                    <button 
                                        className='btn success'
                                        onClick={ () => setOpenModal(true) }>
                                            Оформить заказ
                                    </button>
                                </div>
                                { state.cart.map(category => 
                                    <div key={ category.category } className='product__group'>
                                        <h3>{ category.categoryName }</h3>
                                        { category.products.map(item => 
                                            <div key={ item.id }>
                                                <h4 className="product__name">{ item.name }</h4>
                                                <div className="product_row">
                                                    <div 
                                                        className="product__img" 
                                                        style={{ backgroundImage: `url(${item.image})` }}>
                                                    </div>
                                                    <div className="product__info">
                                                        <p>
                                                            <span className="product__title">
                                                                Описание: 
                                                            </span> 
                                                            { item.description }
                                                        </p>
                                                        <p>
                                                            <span className="product__title">
                                                                Цена: 
                                                            </span> 
                                                            { item.prise }
                                                        </p>
                                                        <p>
                                                            <span className="product__title">
                                                                Магазин: 
                                                            </span> 
                                                            { item.merchantName }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="product__btns">
                                                    <div className="counter">
                                                        <button 
                                                            className="success counter__btn" 
                                                            onClick={ () => handleAdd(item, category) }>
                                                                + 
                                                        </button>
                                                        <span title="counter">{ item.amount }</span>
                                                        <button 
                                                            className="success counter__btn" 
                                                            onClick={ 
                                                                    () => dispatch(removeCount(
                                                                        { 
                                                                            id: item.id, 
                                                                            category: category.category, 
                                                                            prodAmount: item.amount 
                                                                        }
                                                                    ))
                                                            }> 
                                                                - 
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <p>
                                                            <span className="product__title">
                                                                Цена за все: 
                                                            </span> 
                                                            { item.prise * item.amount }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="right">
                                    <p>
                                        <span className="product__title" data-testid='totalSum'>
                                            Общая цена за все товары: { state.totalSum }
                                        </span>
                                    </p>
                                </div>
                                { 
                                    openModal  
                                    ?   <OrderModal 
                                            closeModal={ () => setOpenModal(false) } 
                                            sum={ state.totalSum } 
                                            productsInfo={ state.cart.map(cat => 
                                                cat.products.find(item =>
                                                    ({ 
                                                        id: item.id, 
                                                        amount: item.amount, 
                                                        name: item.name, 
                                                        prise: item.prise,
                                                        merchantId: item.merchantId,
                                                        merchantName: item.merchantName
                                                    })
                                                )!
                                            )}
                                        /> 
                                    :   null 
                                }
                            </div>
                        :   <p className="data_empty">Выбранных товаров нет</p> 
                    }
                </main> 
            } 
            </div>
            
        </>
    )
}
export default ShoppingCart