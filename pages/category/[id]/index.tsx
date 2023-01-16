import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "../../../components/loader";
import { useQuery } from "react-query";
import Header from "../../../components/header";
import Link from "next/link";
import { getProductsList } from "../../api/products.api";

const Category = () => {
    const router = useRouter();
    const id = router.query.id as string;
    const [ products, setProducts ] = useState<{id: string, name: string}[]>([]);
    
    const { isLoading, error, data } = useQuery(
        ['products', id], 
        () => getProductsList(id),
        { enabled: !!id }
    );
    
    useEffect(() => {
        data ? setProducts(data) : null;
    }, [data])

    const handleSearch = (text: string) => {
        text.length 
        ?   setProducts(data.filter((item: { name: string; }) => item.name.toLowerCase().includes(text.toLowerCase())))
        :   setProducts(data)
    }
    
    return (
        <>
            <Header />
            {
                error
                ?   <p className="need-auth">
                        { 'Ошибка ' + error } <br/> <Link href='/'>Вернуться на главную</Link> 
                    </p>
                :   <main>
                        <input 
                            type='text' 
                            className="form-elem action-field" 
                            onKeyUp={ (e) => handleSearch(e.currentTarget.value) }
                            placeholder='Поиск по названию'
                        />
                        {   
                            isLoading 
                            ?   <Loader /> 
                            :   <div className="row">
                                    {
                                        products.length 
                                        ?   products.map(product =>
                                                <button 
                                                    className="row-item" 
                                                    key={ product.id } 
                                                    onClick={ () => router.push(`${id}/product/${ product.id }`) }>
                                                        { product.name }
                                                </button>
                                            ) 
                                        :   <p className="data_empty">Нет товаров в выбранной категории</p>
                                    }
                                </div>
                        }
                    </main>
            }
        </>
    )
}
export default Category