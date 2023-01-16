import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import Loader from "../../components/loader";
import EditProfileModal from "../../components/editProfileModal";
import { UserType } from "../../context/types";
import Link from "next/link";
import { getUser } from "../api/user.api";
import { useStoreContext } from "../../context/context";
import AccessError from "../../components/accessError";
import HeaderManager from "../../components/headerManager";
import { getShopName } from "../api/merchants.api";

const Profile = () => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const queryClient = useQueryClient();
    const [userInfo, setUserInfo] = useState<UserType>();
    const [modal, setModal] = useState(false);
    const closeModal = () => setModal(false);
    const { state } = useStoreContext();
    const [userAccess, setUserAccess] = useState({ token: '', role: '' });
    const [shop, setShop] = useState('');

    useEffect(() => setUserAccess({ token: state.userToken, role: state.userRole }), [state]);
    
    const { isLoading, data, error } = useQuery(
        ['user', userId], 
        () => getUser(userId!)
    );

    const getShop = useQuery(
        ['managerShop', userId],
        () => getShopName(setShop, userId!)
    );

    const fetchUserInfo = () => {
        queryClient.invalidateQueries('user');
        queryClient.invalidateQueries('managerShop');
        setUserInfo(data);
    };
    useEffect(fetchUserInfo, [data]);

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
                                                        { userInfo?.email }
                                                    </p>
                                                    <p>
                                                        <span className="product__title">
                                                            Имя: 
                                                        </span>
                                                        { userInfo?.name }
                                                    </p>
                                                    <p>
                                                        <span className="product__title">
                                                            Магазин: 
                                                        </span>
                                                        { shop }
                                                    </p>
                                                </div>
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
                                userInfo={ userInfo! } 
                                fetchUserInfo={ () => fetchUserInfo() }
                            /> 
                        :   null
                    }
                    </>
            }
        </>
    )
}

export default Profile
