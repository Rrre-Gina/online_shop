import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Link from "next/link";
import Loader from "../../components/loader";
import { OrderType } from "../../context/types";
import Pagination from "../../components/pagination";
import { getShopOrders } from "../api/orders.api";
import EditStatusModal from "../../components/editStatusModal";
import { useStoreContext } from "../../context/context";
import AccessError from "../../components/accessError";
import HeaderManager from "../../components/headerManager";
import { getUserShop } from "../api/merchants.api";
import { getUserName } from "../api/user.api";
import { PhoneNumber } from "../../components/phoneNumberMask";

const Orders = () => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const [page, setPage] = useState(1);
    const [openId, setOpenId] = useState();
    const [update, setUpdate] = useState(false);
    const [orders, setOrders] = useState([]);
    const { state } = useStoreContext();
    const [userAccess, setUserAccess] = useState({ token: '', role: '' });
    const [shop, setShop] = useState('');
    const [shopUsersName, setShopUsersName] = useState(['']);

    useEffect(() => setUserAccess({ token: state.userToken, role: state.userRole }), [state]);

    const getManagerShop = useQuery(
        ['managerShop', userId, userAccess.role],
        () => getUserShop(setShop, userAccess.role, userId!)
    );

    const { isLoading, error, data } = useQuery(
        ["orders", page, shop],
        () => getShopOrders(shop, page)
    );

    useEffect(() => {
        data ? setOrders(data) : null
    }, [data, shop])

    const handleSearch = (text: string) => {
        text.length 
        ?   setOrders(data.filter((item: { id: string; }) => item.id.toLowerCase().includes(text.toLowerCase())))
        :   setOrders(data)
    }

    return (
        <>
            {
                !userAccess.token?.length || userAccess.role !== 'manager'
                ?   <AccessError />
                :   <>
                    <HeaderManager />
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
                                    onChange={ (e) => handleSearch(e.currentTarget.value) } 
                                    placeholder='Поиск по ID заказа'
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
                                                                className="cursor list" 
                                                                onClick={ () => {
                                                                    setOpenId(order.id)
                                                                    getUserName([order.userId], setShopUsersName)
                                                                } }
                                                            >
                                                                <span className="list__titles">{ order.id }</span> 
                                                                <span className="list__titles">{ order.date }</span> 
                                                                <span className="list__titles">{ order.status }</span> 
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