import { useEffect, useState } from "react";
import HeaderAdmin from "../../components/headerAdmin";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Link from "next/link";
import Loader from "../../components/loader";
import { UserType } from "../../context/types";
import AddUserForm from "../../components/addUserForm";
import EditUserModal from "../../components/editUserModal";
import { deleteUser, fetchUserData, handleSearchUser } from "../api/user.api";
import Pagination from "../../components/pagination";
import { deleteUserFromShop } from "../api/merchants.api";
import { useStoreContext } from "../../context/context";
import AccessError from "../../components/accessError";

const Users = () => {
    const queryClient = useQueryClient();
    const [addForm, setAddForm] = useState(false);
    const [update, setUpdate] = useState(false);
    const [userToUpdate, setUserToUpdate] = useState({ id: '', name: '', email: '', password: '', role: '' });
    const [page, setPage] = useState(1);
    const { state } = useStoreContext();
    const [userAccess, setUserAccess] = useState({ token: '', role: '' });
    const [users, setUsers] = useState([]);

    useEffect(() => setUserAccess({ token: state.userToken, role: state.userRole }), [state]);
        
    const { data, isLoading, error } = useQuery(
        ["users", page],
        () => fetchUserData(page),
        {
            keepPreviousData: true,
        }
    );

    useEffect(() => { data ? setUsers(data) : null }, [data])
    
    const { mutate } = useMutation(
        async (user: { id: string, role: string }) => {
            if (user.role === 'manager') {
                deleteUserFromShop(user.id)
            }
            deleteUser(user.id)
        }, 
        {
            onSuccess: () => queryClient.invalidateQueries('users'),
        }
    );

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
                                    <h3 className="page-title">Справочники / Пользователи </h3>
                                    
                                    <input 
                                        type='text' 
                                        className="form-elem action-field" 
                                        onChange={ (e) => handleSearchUser(e.currentTarget.value, setUsers) } 
                                        placeholder='Поиск'
                                        role='searchField'
                                    />
                                    
                                    <h4 
                                        className="form-opening"
                                        onClick={ () => setAddForm(!addForm) }>
                                            Добавить пользователя { addForm ? <span>&#11165;</span> : <span>&#11167;</span> } 
                                    </h4>

                                    {
                                        addForm
                                        ?   <AddUserForm closeForm={ () => setAddForm(false) }/>
                                        :   null
                                    }

                                    <div>
                                        {
                                            isLoading
                                            ?   <div className="section-title">
                                                    <Loader/>
                                                </div>
                                            :   <>
                                                    <ul>
                                                    { 
                                                        users?.map((user: UserType) => 
                                                            <li key={ user.id }> 
                                                                <div className="list">
                                                                    <span className="list__titles user_id">
                                                                        { user.id }
                                                                    </span>
                                                                    <span className="list__titles">
                                                                        { user.name }
                                                                    </span> 
                                                                    <span className="list__titles">
                                                                        { user.email }
                                                                    </span> 
                                                                    <span className="list__titles">
                                                                        { 
                                                                            user.role === 'customer' ? 'Внешний пользователь'
                                                                            : user.role === 'manager' ? 'Менеджер магазина'
                                                                            : 'Администратор'
                                                                        }
                                                                    </span>
                                                                    <div>
                                                                        <button 
                                                                            className="list__btn-icon"
                                                                            onClick={ () => { 
                                                                                setUpdate(true) 
                                                                                setUserToUpdate(user) }
                                                                            }
                                                                            > 
                                                                                &#9998; 
                                                                        </button> 
                                                                        <button 
                                                                            className="list__btn-icon bold"
                                                                            onClick={ () => mutate({ id: user.id, role: user.role }) }> 
                                                                                &#128465; 
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </li>    
                                                        )
                                                    }
                                                    </ul>
                                                </>
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
                                        ?   <EditUserModal 
                                                closeModal={ () => setUpdate(false) } 
                                                user={ userToUpdate } 
                                            />
                                        :   null
                                    }
                                </main>
                        }
                    </>
            }        
        </>
    )
}
export default Users