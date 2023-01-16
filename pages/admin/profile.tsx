import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import HeaderAdmin from "../../components/headerAdmin";
import Loader from "../../components/loader";
import EditProfileModal from "../../components/editProfileModal";
import { UserType } from "../../context/types";
import Link from "next/link";
import { getUser } from "../api/user.api";
import { useStoreContext } from "../../context/context";
import AccessError from "../../components/accessError";

const Profile = () => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const queryClient = useQueryClient();
    const [userInfo, setUserInfo] = useState<UserType>();
    const [modal, setModal] = useState(false);
    const closeModal = () => setModal(false);
    const { state } = useStoreContext();
    const [userAccess, setUserAccess] = useState({ token: '', role: '' });

    useEffect(() => setUserAccess({ token: state.userToken, role: state.userRole }), [state]);
    
    const { isLoading, data, error } = useQuery(
        'user', 
        userId 
        ?   () => getUser(userId)
        :   () => null
    );

    const fetchUserInfo = () => {
        queryClient.invalidateQueries('user');
        setUserInfo(data);
    }
    useEffect(fetchUserInfo, [data]);

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
