import { useEffect, useState } from "react";
import HeaderAdmin from "../../components/headerAdmin";
import { useQuery } from "react-query";
import Link from "next/link";
import Loader from "../../components/loader";
import Pagination from "../../components/pagination";
import { useStoreContext } from "../../context/context";
import AccessError from "../../components/accessError";
import { getShops } from "../api/merchants.api";
import AddShopForm from "../../components/addShopForm";
import EditShopModal from "../../components/editShopModal";
import { getUserName } from "../api/user.api";

const Shops = () => {
    const { state } = useStoreContext();
    const [addForm, setAddForm] = useState(false);
    const [update, setUpdate] = useState(false);
    const [shopToUpdate, setShopToUpdate] = useState({ id: '', merchantName: '', merchantUsers: [''] });
    const [page, setPage] = useState(1);
    const [userAccess, setUserAccess] = useState({ token: '', role: '' });
    const [shopUsersName, setShopUsersName] = useState(['']);
    const [openId, setOpenId] = useState();

    useEffect(() => setUserAccess({ token: state.userToken, role: state.userRole }), [state]);

    const { isLoading, error, data } = useQuery(
        ["shops", page],
        () => getShops(page),
        {
            keepPreviousData: true,
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
                                { 'Ошибка ' + error } 
                                <br/> 
                                <Link href='/admin'>Вернуться на главную</Link> 
                            </p>
                        :   <main>
                                <h3 className="page-title">Справочники / Магазины </h3>
                                
                                <h4 
                                    className="form-opening"
                                    onClick={ () => setAddForm(!addForm) }>
                                        Добавить магазин { addForm ? <span>&#11165;</span> : <span>&#11167;</span> } 
                                </h4>

                                {
                                    addForm
                                    ?   <AddShopForm closeForm={ () => setAddForm(false) }/>
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
                                                    data?.map(
                                                        (shop: { id: any, merchantName: string, merchantUsers: string[] }) =>
                                                            <li key={ shop.id } className='border'> 
                                                                <div    
                                                                    className="list cursor" 
                                                                    onClick={ () => { 
                                                                        getUserName(shop.merchantUsers, setShopUsersName); 
                                                                        setOpenId(shop.id);
                                                                    }}
                                                                >
                                                                    <span>{ shop.merchantName }</span>  
                                                                    <div>
                                                                        <button 
                                                                            className="list__btn-icon"
                                                                            onClick={ () => { 
                                                                                setUpdate(true) 
                                                                                setShopToUpdate(shop) }
                                                                            }> 
                                                                                &#9998; 
                                                                        </button> 
                                                                    </div>
                                                                </div>
                                                                <div className={ openId === shop.id ? 'detail-info' : 'hide' }>
                                                                    <div className="space-between flex-start">
                                                                        <div className="details">
                                                                            <span className="title product__title">
                                                                                Менеджеры магазина:
                                                                            </span>
                                                                            { shopUsersName.map(name => 
                                                                                <p key={ name }>
                                                                                    { name }
                                                                                </p>
                                                                            ) }
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
                                    ?   <EditShopModal 
                                            closeModal={ () => setUpdate(false) } 
                                            shop={ shopToUpdate } 
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
export default Shops