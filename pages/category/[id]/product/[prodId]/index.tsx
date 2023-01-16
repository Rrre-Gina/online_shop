import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useStoreContext } from "../../../../../context/context";
import Header from "../../../../../components/header";
import Loader from "../../../../../components/loader";
import { addProduct, removeCount } from "../../../../../context/actions";
import Link from "next/link";
import { getProductInfo } from "../../../../api/products.api";

const Product = () => {
    const router = useRouter();
    const prodId = router.query.prodId as string;
    const id = Number(prodId);
    const { state, dispatch } = useStoreContext();
    const [userToken, setUserToken] = useState('');
    const [product, setProduct] = useState({ 
        id: null, 
        name: '', 
        description: '', 
        category: 0, 
        categoryName: '', 
        prise: 0, 
        image: '', 
        merchantId: [''],
        merchantName: [''],
        amount: 0 
    });
    const style = { backgroundImage: `url(${product.image})` };
    const [ selectShop, setSelectShop ] = useState(false);

    const { isLoading, error, data } = useQuery(
        ['product', prodId], 
        () => getProductInfo(prodId),
        { enabled: !!prodId }
    );
   
    useEffect(() => {        
        setUserToken(state.userToken);
        const category = data ? state.cart.find(cat => cat.category === data.category) : null;
        const currentAmount = category ? category.products.find(prod => prod.id === id) : null;

        currentAmount 
        ? setProduct({ ...data, amount: currentAmount.amount })
        : setProduct({ ...data, amount: 0 })
    }, [data])

    const handleRemove = () => {
        setProduct(prev => { return { ...prev, amount: prev.amount - 1 } });
        dispatch(removeCount({ id: id, category: product.category, prodAmount: product.amount })); 
    }

    const handleSelectShop = (name: string, idx: number) => {
        state.cart.find(cat => cat.category === data.category)!.products
            .find(prod => prod.id === id)!.merchantName = [name];
        state.cart.find(cat => cat.category === data.category)!.products
            .find(prod => prod.id === id)!.merchantId = [product.merchantId[idx]]
        setSelectShop(false)
    }

    return (
        <>
            <Header />
            {
                error
                ?   <p className="need-auth">
                        { 'Ошибка ' + error } <br/> <Link href='/'>Вернуться на главную</Link> 
                    </p>
                :   <main>
                        {   isLoading 
                            ?   <div className="section-title"><Loader /></div> 
                            :   <div className="product">
                                    <h4 className="product__name">{ product.name }</h4>
                                    <div className="product_row">
                                        <div className="product__img" style={ style }></div>
                                        <div className="product__info">
                                            <p>
                                                <span className="product__title">Описание:</span> 
                                                { product.description }
                                            </p>
                                            <p>
                                                <span className="product__title">Цена:</span> 
                                                { product.prise }
                                            </p>
                                            <p>
                                                <span className="product__title">Магазины:</span> 
                                                { product.merchantName && product.merchantName.join(' | ') }
                                            </p>
                                        </div>
                                    </div>
                                    { 
                                        !userToken  
                                        ?   <p className="need-auth">
                                                Для создания заказа необходимо <Link href='/auth'>авторизоваться</Link>
                                            </p> 
                                        :   <>
                                            { 
                                                selectShop 
                                                ?   <div className="select-shop">
                                                        <span>Пожалуйста, выберите магазин</span>
                                                        { product.merchantName.map((name, idx) => 
                                                            <button 
                                                                key={ name }
                                                                className="order-list__products btn select-btn"
                                                                onClick={ () => handleSelectShop(name, idx) }>
                                                                    { name }
                                                            </button>   
                                                        ) }
                                                    </div>
                                                :   <div className="product__btns">
                                                    {
                                                        product.amount === 0
                                                        ?   <button 
                                                                className="btn success" 
                                                                onClick={ () => {
                                                                    dispatch(addProduct(product));
                                                                    setProduct(prev => { 
                                                                        return { ...prev, amount: prev.amount + 1 } 
                                                                    })
                                                                    product.merchantName.length > 1 ? setSelectShop(true) : null
                                                                } }>
                                                                    Добавить в корзину
                                                            </button>
                                                        :   <div className="counter">
                                                                <button 
                                                                    className="success counter__btn" 
                                                                    onClick={ () => {
                                                                        dispatch(addProduct(product))
                                                                        setProduct(prev => { 
                                                                            return { ...prev, amount: prev.amount + 1 } 
                                                                        })
                                                                    } }> 
                                                                        +
                                                                </button>
                                                                <span> { product.amount } </span>
                                                                <button 
                                                                    className="success counter__btn" 
                                                                    onClick={ () => handleRemove() }> 
                                                                        - 
                                                                </button>
                                                            </div>
                                                    }
                                                    </div>
                                            }
                                            
                                            <div className="right">
                                                <button 
                                                    className="btn cart-btn" 
                                                    onClick={ () => router.push('/cart') }>
                                                        Перейти в корзину
                                                </button>
                                            </div>
                                            </> 
                                    }
                            </div> 
                        }
                    </main>
            }
        </>
    )
}
export default Product
