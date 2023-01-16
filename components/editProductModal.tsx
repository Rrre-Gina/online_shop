import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Loader from "./loader";
import { EditProductProps, ProductType } from "../context/types";
import { useState } from "react";
import * as Yup from "yup";
import Multiselect from "multiselect-react-dropdown";
import { editProduct } from "../pages/api/products.api";
import { getShopsInForm } from "../pages/api/merchants.api";
import { getCategoriesInForm } from "../pages/api/categoties.api";

const EditProductModal = ({ closeModal, product }: EditProductProps) => {
    const queryClient = useQueryClient();
    const [ categories, setCategories ] = useState([]);
    const [ shops, setShops ] = useState([]);
    const [ selectedCategory, setSelectedCategory ] = useState({ id: product.category, name: product.categoryName });
    const [ selectedShops, setSelectedShops ] = useState({ id: product.merchantId, merchantName: product.merchantName });

    document.body.classList.add('scroll_block');

    const ValidateSchema = Yup.object().shape({
        name: Yup.string()
            .required('Поле обязательно для заполнения'),
        prise: Yup.number()
            .required('Поле обязательно для заполнения'),
        description: Yup.string()
            .required('Поле обязательно для заполнения'),
        image: Yup.string()
            .required('Поле обязательно для заполнения')
    });
    
    const { mutate, isLoading } = useMutation(
        async (data: ProductType) => editProduct(data), 
        {
            onSuccess: () => {
                closeModal();
                queryClient.invalidateQueries('products'); 
            }
        }
    );

    const getShops = useQuery(
        'shops', 
        () => getShopsInForm(setShops)
    );

    const getCategories = useQuery(
        'categories', 
        () => getCategoriesInForm(setCategories)
    );
    
    const preSelectedShops: { id: string; merchantName: string; }[] = [];
    for (let i = 0; i < product.merchantId.length; i++) {
        let customObject = {
            id: product.merchantId[i],
            merchantName: product.merchantName[i]
        }
        preSelectedShops.push(customObject);
    }

    const onSelectCategory = (category: [{ id: number, name: string }]) => setSelectedCategory(category[0]);
    const onSelectShops = (selectedShops: [{ id: string, merchantName: string }]) => {
        setSelectedShops({ 
            id: selectedShops.map((shop: { id: string; }) => shop.id), 
            merchantName: selectedShops.map((shop: { merchantName: string; }) => shop.merchantName) 
        });
    };

    return (
        <div className="background-modal">
            <div className="modal">
                <button 
                    className="modal-close" 
                    onClick={ closeModal } > 
                        &#10006; 
                </button>
                <div className="modal__content">
                    <span className="modal__title">Редактировать товар</span>
                    { 
                        isLoading 
                        ?   <div className="loader-background">
                                <Loader />
                            </div> 
                        :    <Formik 
                                initialValues={{ 
                                    name: product.name, 
                                    prise: product.prise, 
                                    description: product.description, 
                                    category: product.category, 
                                    image: product.image 
                                }}
                                validationSchema={ ValidateSchema }
                                onSubmit={ (values) => {
                                        const data = {
                                            id: product.id,
                                            name: values.name,
                                            prise: values.prise, 
                                            description: values.description, 
                                            image: values.image,
                                            category: selectedCategory.id,
                                            categoryName: selectedCategory.name,
                                            merchantId: selectedShops.id,
                                            merchantName: selectedShops.merchantName
                                        }
                                        mutate(data); 
                                } }
                            >
                                { (values) => (
                                    <Form className="modal__form product__modal">
                                        <Field  
                                            type="text" 
                                            name="name" 
                                            className="form-elem" 
                                            placeholder="Укажите название"
                                        />
                                        <ErrorMessage 
                                            name="name" 
                                            className="error-message" 
                                            component="small"
                                        />

                                        <Field 
                                            type="number" 
                                            name="prise" 
                                            className="form-elem" 
                                            placeholder="Укажите цену"
                                        />
                                        <ErrorMessage 
                                            name="prise" 
                                            className="error-message" 
                                            component="small"
                                        />

                                        <Field 
                                            type="text" 
                                            name="image" 
                                            className="form-elem" 
                                            placeholder="Укажите ссылку на фото"
                                        />
                                        <ErrorMessage 
                                            name="image" 
                                            className="error-message" 
                                            component="small"
                                        />

                                        <Field 
                                            as='textarea' 
                                            name="description"
                                            className="form-elem" 
                                            placeholder="Укажите описание товара"
                                        /> 
                                        <ErrorMessage 
                                            name="description" 
                                            className="error-message" 
                                            component="small"
                                        />

                                        <div className="max-width">
                                            <Multiselect
                                                options={ categories }
                                                selectedValues={[{ id: product.category, name: product.categoryName }]}
                                                onSelect={ onSelectCategory } 
                                                displayValue="name" 
                                                placeholder='Выберите категорию'
                                                className="form-elem"
                                                hidePlaceholder={ true } 
                                                selectionLimit={1}
                                            />
                                        </div>

                                        <div className="max-width">
                                            <Multiselect
                                                options={ shops }
                                                selectedValues={ preSelectedShops }
                                                onSelect={ onSelectShops } 
                                                displayValue="merchantName" 
                                                placeholder='Выберите магазин'
                                                className="form-elem"
                                                hidePlaceholder={ true } 
                                            />
                                        </div>
                                        
                                        <button 
                                            type="submit" 
                                            className="success form-elem btn"> 
                                                Сохранить 
                                        </button>
                                    </Form>
                                ) }
                            </Formik>
                    }
                </div>
            </div>
        </div>
    )
}
export default EditProductModal