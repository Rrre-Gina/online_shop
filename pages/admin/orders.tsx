import { useEffect, useState } from "react";
import HeaderAdmin from "../../components/headerAdmin";
import { useQuery } from "react-query";
import Link from "next/link";
import Loader from "../../components/loader";
import { OrderType } from "../../context/types";
import Pagination from "../../components/pagination";
import { getOrders, handleSearch } from "../api/orders.api";
import EditStatusModal from "../../components/editStatusModal";
import { useStoreContext } from "../../context/context";
import AccessError from "../../components/accessError";
import { getUserName } from "../api/user.api";
import { PhoneNumber } from "../../components/phoneNumberMask";

const Orders = () => {
    const [page, setPage] = useState(1);
    const [update, setUpdate] = useState(false);
    const [orders, setOrders] = useState([]);
    const { state } = useStoreContext();
    const [userAccess, setUserAccess] = useState({ token: '', role: '' });
    const [shopUsersName, setShopUsersName] = useState(['']);
    const [openId, setOpenId] = useState();

    useEffect(() => setUserAccess({ token: state.userToken, role: state.userRole }), [state]);

    const { isLoading, error, data } = useQuery(
        ["orders", page],
        () => getOrders(page),
        {
            keepPreviousData: true,
        }
    );

    useEffect(() => { data ? setOrders(data) : null }, [data])

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
                                { 'Ошибка ' + error } <br/> <Link href='/admin'>Вернуться на главную</Link> 
                            </p>
                        :   <main>
                                <h3 className="page-title">Справочники / Заказы </h3>
                                <input 
                                    type='text' 
                                    className="form-elem action-field" 
                                    onChange={ (e) => handleSearch(e.currentTarget.value, setOrders) } 
                                    placeholder='Поиск по ID'
                                    role='searchField'
                                />
                                <div>
                                    {
                                        isLoading
                                        ?   <div className="section-title">
                                                <Loader/>
                                            </div>
                                        :   <ul>
                                                { 
                                                    orders?.map((order: OrderType) => 
                                                        <li key={ order.id } className='border'> 
                                                            <div 
                                                                className="list cursor" 
                                                                onClick={ () => {
                                                                    setOpenId(order.id)
                                                                    getUserName([order.userId], setShopUsersName)
                                                                } }>
                                                                <span className="details">{ order.id }</span> 
                                                                <span className="details">{ order.date }</span> 
                                                                <span className="details">{ order.status }</span> 
                                                            </div>
                                                            <div className={ openId === order.id ? 'detail-info' : 'hide' }>
                                                                <div className="space-between flex-start">
                                                                    <div className="details">
                                                                        <span className="title product__title">
                                                                            Информация о заказе
                                                                        </span>
                                                                        <p>
                                                                            <span className="product__title order-title">
                                                                                Покупатель: 
                                                                            </span>
                                                                            { shopUsersName + ' ' + '(ID: ' + order.userId + ')'}
                                                                        </p>
                                                                        <p>
                                                                            <span className="product__title order-title">
                                                                                Адрес доставки: 
                                                                            </span>
                                                                            { order.address }
                                                                        </p>
                                                                        <p>
                                                                            <span className="product__title order-title">
                                                                                Контактный номер: 
                                                                            </span>
                                                                            { PhoneNumber(order.phone) }
                                                                        </p>
                                                                        <p>
                                                                            <span className="product__title order-title">
                                                                                Ожидаемая дата получения: 
                                                                            </span>
                                                                            { order.date }
                                                                        </p>
                                                                        <p>
                                                                            <span className="product__title order-title">
                                                                                Способ оплаты: 
                                                                            </span>
                                                                            { order.pay }
                                                                        </p>
                                                                        <p>
                                                                            <span className="product__title order-title">
                                                                                Общая цена: 
                                                                            </span>
                                                                            { order.sum }
                                                                        </p>
                                                                    </div> 

                                                                    <div className="details">
                                                                        <span className="title product__title">
                                                                            Информация о товарах
                                                                        </span>
                                                                        { 
                                                                            order.orderProducts.map(product => 
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
                                                                                            Mагазин: 
                                                                                        </span>
                                                                                        { product.merchantName }
                                                                                    </p>
                                                                                </div> 
                                                                            )
                                                                        }
                                                                    </div> 
                                                                </div>
                                                                <button 
                                                                    onClick={ () => setUpdate(true) } 
                                                                    className="status-btn order-title"
                                                                > 
                                                                    <span className="status-btn__icon">&#128505;</span> 
                                                                    <span>Сменить статус</span>
                                                                </button> 
                                                                { 
                                                                    update 
                                                                    ?   <EditStatusModal 
                                                                            closeModal={ () => setUpdate(false) } 
                                                                            status={ order.status } 
                                                                            id={ order.id }
                                                                        />
                                                                    :   null
                                                                }
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
                            </main>
                    }
                    </>
            }
        </>
    )
}
export default Orders