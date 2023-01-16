import { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Loader from "../components/loader";
import Header from "../components/header";
import Link from "next/link";
import { getCategories, handleSearch } from "./api/categoties.api";

const Categories = () => {
    const router = useRouter();
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);

    const { isLoading, error, data } = useQuery('categories', getCategories);

    useEffect(() => {
        data ? setCategories(data) : null
    }, [data])

    return (
        <>
        <Header />
        {
            error
            ?   <p className="need-auth">
                    { 'Ошибка ' + error } <br/> <Link href='/'>Вернуться на главную</Link> 
                </p>
            :   
                <main>
                    <input 
                        type='text' 
                        className="form-elem action-field" 
                        onChange={ (e) => handleSearch(e.currentTarget.value, setCategories) } 
                        placeholder='Поиск по названию'
                        role='searchField'
                    />
                    {   
                        isLoading 
                        ?   <Loader />
                        :   <div className="row" data-testid="categiry-list">
                                { 
                                    categories.length 
                                    ?   categories.map(category => 
                                            <button 
                                                className="row-item" 
                                                key={ category.id }
                                                onClick={ () => router.push(`category/${ category.id }`) }>
                                                    { category.name }
                                            </button>
                                        ) 
                                    :   <p className="data_empty">Категории не найдены</p> 
                                }
                            </div>
                    }
                </main>
        }
            
        </>
    )
}

export default Categories