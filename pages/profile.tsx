import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import Header from "../components/header";
import Loader from "../components/loader";
import EditProfileModal from "../components/editProfileModal";
import { OrderType } from "../context/types";
import Link from "next/link";
import { getUser } from "./api/user.api";
import { getUserOrders } from "./api/orders.api";
import { PhoneNumber } from "../components/phoneNumberMask";

const Profile = () => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const [ordersHistory, setOrdersHistory] = useState<OrderType[]>();
    const [orderProductsInfo, setOrderProductsInfo] = useState([{}]);
    const [modal, setModal] = useState(false);
    const closeModal = () => setModal(false);
    const queryClient = useQueryClient();

    const { isLoading, data, error } = useQuery(
        'user', 
        userId 
        ?   () => getUser(userId)
        :   () => null
    );
    
    const fetchOrdersInfo = useQuery(
        ['orders', userId],
        () => getUserOrders(userId!, setOrdersHistory),
        { enabled: !!userId }
    );

    const toggleFunction = (id: any) => setOrderProductsInfo({ ...orderProductsInfo, [id]: !orderProductsInfo[id] });

    return (
        <>
            <Header />
            {
                error
                ?   <p className="need-auth">
                        { 'Ошибка ' + error } <br/> <Link href='/'>Вернуться на главную</Link> 
                    </p>
                :   isLoading 
                    ?   <div className="section-title">
                            <Loader />
                        </div> 
                    :   <div>
                        { 
                            !userId 
                            ?   <main> 
                                    <p className="need-auth">
                                        Для перехода в профиль необходимо <Link href='/auth'>авторизоваться</Link> 
                                    </p>
                                </main>
                            :   <main>
                                    <div>
                                        <div className="product">
                                            <div className="space-between">
                                                <h2>Профиль</h2>
                                                <button 
                                                    className="btn success" 
                                                    onClick={ () => setModal(true) }>
                                                        Редактировать
                                                </button>
                                            </div>
                                            <div>
                                                <p aria-label='user-email'>
                                                    <span className="product__title">
                                                        Email: 
                                                    </span>
                                                    { data?.email }
                                                </p>
                                                <p>
                                                    <span className="product__title">
                                                        Имя: 
                                                    </span>
                                                    { data?.name }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="product">
                                            <h3 className="section-title">История заказов</h3>
                                            { 
                                                ordersHistory?.map(item => 
                                                    <div 
                                                        key={ item.id } 
                                                        className="max-width order-list" 
                                                        onClick={ () => toggleFunction(item.id) }
                                                    >   
                                                        <p className="order__id">
                                                            <span className="product__title order-title">
                                                                ID заказа:
                                                            </span>
                                                            { item.id }
                                                        </p>
                                                        <div className="space-between">
                                                            <div className="order-list__item">
                                                                <span className="product__title order-title">
                                                                    Дата получения:
                                                                </span>
                                                                <span>
                                                                    { item.date }
                                                                </span>
                                                            </div>
                                                            <div className="order-list__item">
                                                                <span className="product__title order-title">
                                                                    Адрес:
                                                                </span>
                                                                <span>
                                                                    { item.address }
                                                                </span>
                                                            </div>
                                                            <div className="order-list__item">
                                                                <span className="product__title order-title">
                                                                    Контактный номер:
                                                                </span>
                                                                <span>
                                                                { PhoneNumber(item.phone) }
                                                                </span>
                                                            </div>
                                                            <div className="order-list__item">
                                                                <span className="product__title order-title">
                                                                    Сумма:
                                                                </span>
                                                                <span>
                                                                    { item.sum }
                                                                </span>
                                                            </div>
                                                            <div className="order-list__item">
                                                                <span className="product__title order-title">
                                                                    Способ оплаты:
                                                                </span>
                                                                <span>
                                                                    { item.pay }
                                                                </span>
                                                            </div>
                                                            <div className="order-list__item">
                                                                <span className="product__title order-title">
                                                                    Статус заказа:
                                                                </span>
                                                                <span>
                                                                    { item.status }
                                                                </span>
                                                            </div>
                                                        </div>  
                                                        <div className={ orderProductsInfo[item.id] ? '' : 'hide' }>
                                                            <h4 className="title">Товары заказа</h4>
                                                            { 
                                                                item.orderProducts.map(product => 
                                                                    <div 
                                                                        className="order-list__products" 
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
                                                                                Цена: 
                                                                            </span>
                                                                            { product.prise }
                                                                        </p>
                                                                        <p>
                                                                            <span className="product__title order-title">
                                                                                Количество: 
                                                                            </span>
                                                                            { product.amount }
                                                                        </p>
                                                                        <p>
                                                                            <span className="product__title order-title">
                                                                                Магазин: 
                                                                            </span>
                                                                            { product.merchantName }
                                                                        </p>
                                                                    </div> 
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </main> 
                        }
                        </div>
            }
            { 
                modal 
                ?   <EditProfileModal 
                        closeModal={ closeModal } 
                        userInfo={ data } 
                        fetchUserInfo={ () => queryClient.invalidateQueries('user') }
                    /> 
                :   null
            }
        </>
    )
}

export default Profile
