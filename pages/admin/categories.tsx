import { useEffect, useState } from "react";
import HeaderAdmin from "../../components/headerAdmin";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Link from "next/link";
import Loader from "../../components/loader";
import { CategoryType } from "../../context/types";
import EditCategoryModal from "../../components/editCategoryModal";
import Pagination from "../../components/pagination";
import { getCategory, removeCategory } from "../api/categoties.api";
import AddCategoryForm from "../../components/addCategoryForm";
import { useStoreContext } from "../../context/context";
import AccessError from "../../components/accessError";

const Categories = () => {
    const queryClient = useQueryClient();
    const { state } = useStoreContext();
    const [addForm, setAddForm] = useState(false);
    const [update, setUpdate] = useState(false);
    const [categoryToUpdate, setCategoryToUpdate] = useState({ id: 0, name: '' });
    const [page, setPage] = useState(1);
    const [userAccess, setUserAccess] = useState({ token: '', role: '' });

    useEffect(() => setUserAccess({ token: state.userToken, role: state.userRole }), [state]);

    const { isLoading, error, data } = useQuery(
        ["categories", page],
        () => getCategory(page),
        {
            keepPreviousData: true,
        }
    )

    const deleteCategory = useMutation((id: number) => removeCategory(id));
    
    const mutation = async (id: number) => {
        await deleteCategory.mutateAsync(id);
        queryClient.invalidateQueries('categories')
    }

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
                                <h3 className="page-title">Справочники / Категории </h3>
                                
                                <h4 
                                    className="form-opening"
                                    onClick={ () => setAddForm(!addForm) }>
                                        Добавить категорию { addForm ? <span>&#11165;</span> : <span>&#11167;</span> } 
                                </h4>

                                {
                                    addForm
                                    ?   <AddCategoryForm closeForm={ () => setAddForm(false) }/>
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
                                                    data?.map((category: CategoryType) => 
                                                        <li key={ category.id }> 
                                                            <div className="list">
                                                                <span>{ category.name }</span> 
                                                                <div>
                                                                    <button 
                                                                        className="list__btn-icon"
                                                                        onClick={ () => { 
                                                                            setUpdate(true) 
                                                                            setCategoryToUpdate(category) }
                                                                        }> 
                                                                            &#9998; 
                                                                    </button> 
                                                                    <button 
                                                                        className="list__btn-icon bold"
                                                                        onClick={ () => mutation(category.id) }> 
                                                                            &#128465; 
                                                                    </button>
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
                                    ?   <EditCategoryModal 
                                            closeModal={ () => setUpdate(false) } 
                                            category={ categoryToUpdate } 
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
export default Categories