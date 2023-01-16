import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import AccessError from "../../components/accessError";
import EditShopModal from "../../components/editShopModal";
import HeaderManager from "../../components/headerManager";
import Loader from "../../components/loader";
import { useStoreContext } from "../../context/context";
import { getShopInfo } from "../api/merchants.api";
import { getUserName } from "../api/user.api";

const Shop = () => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const { state } = useStoreContext();
    const [userAccess, setUserAccess] = useState({ token: '', role: '' });
    const [shop, setShop] = useState({ id: '', merchantName: '', merchantUsers: [''] });
    const [modal, setModal] = useState(false);
    const [names, setNames] = useState(['']);

    useEffect(() => setUserAccess({ token: state.userToken, role: state.userRole }), [state]);

    const { isLoading, error } = useQuery(
        ['shop', userId], 
        () => getShopInfo(setShop, userId!)
    );

    const getManagerName = useQuery(
        ['managerShop', shop],
        () => getUserName(shop.merchantUsers, setNames)
    )

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
                                { 'Ошибка ' + error } <br/> <Link href='/'>Вернуться на главную</Link> 
                            </p>
                        :   isLoading 
                            ?   <div className="section-title">
                                    <Loader />
                                </div> 
                            :   <div>
                                { 
                                    <main> 
                                        <div>
                                            <div className="product">
                                                <div className="space-between">
                                                    <h2>Магазин { shop.merchantName }</h2>
                                                    <button 
                                                        className="btn success" 
                                                        onClick={ () => setModal(true) }>
                                                            Редактировать
                                                    </button>
                                                </div>
                                                <div className="max-width">
                                                    <p aria-label='user-email'>
                                                        <span className="product__title">
                                                            ID: 
                                                        </span>
                                                        { shop.id }
                                                    </p>
                                                    <p>
                                                        <span className="product__title">
                                                            Название: 
                                                        </span>
                                                        { shop.merchantName }
                                                    </p>
                                                    <div className="details">
                                                        <span className="product__title">
                                                            Менеджеры: 
                                                        </span>
                                                        <div className="space-between">
                                                            <div>
                                                                { names.map((user, idx) => 
                                                                    <p key={ idx }>{ user }</p>    
                                                                ) }
                                                            </div>
                                                            <div>
                                                                { shop.merchantUsers.map((userId, idx) => 
                                                                    <p key={ idx }>{ '(ID: ' + userId + ')' }</p>    
                                                                ) }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </main> 
                                }
                                </div>
                    }
                    { 
                        modal 
                        ?   <EditShopModal 
                                closeModal={ () => setModal(false) } 
                                shop={ shop }
                            /> 
                        :   null
                    }
                    </>
            }
        </>
    )
}

export default Shop