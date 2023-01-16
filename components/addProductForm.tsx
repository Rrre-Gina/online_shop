import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CloseFormType, ProductType } from "../context/types";
import Notification from "./notification";
import * as Yup from "yup";
import Multiselect from 'multiselect-react-dropdown';
import { createProduct } from "../pages/api/products.api";
import { getShopsInForm } from "../pages/api/merchants.api";
import { getCategories } from "../pages/api/categoties.api";

const AddProductForm = ({ closeForm }: CloseFormType) => {
    const queryClient = useQueryClient();
    const [ defaultError, setError ] = useState('');
    const [ allShops, setAllShops ] = useState([{ id: '', merchantName: '' }]);
    const [ selectedShops, setSelectedShops ] = useState({ id: [''], merchantName: [''] });
    const [ category, setCategory ] = useState({ id: 0, name: '' });

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

    const { mutate } = useMutation(
        (product: ProductType) => createProduct(product), 
        {
            onSuccess: () => {
                queryClient.invalidateQueries('products');
                closeForm();
            },
            onError: (error: any) => { 
                error.response ? setError(error.response.data) 
                : error.name ? setError(error.name + ': ' + error.message) 
                : setError(error) 
            }
        }
    );

    const { data } = useQuery('categories', getCategories);

    const getShops = useQuery(
        'shops',
        () => getShopsInForm(setAllShops)
    );

    const onSelectShops = (selectedShops: [{ id: string, merchantName: string }]) => {
        setSelectedShops({ 
            id: selectedShops.map((shop: { id: string; }) => shop.id), 
            merchantName: selectedShops.map((shop: { merchantName: string; }) => shop.merchantName) 
        });
    };

    const onSelectCategory = (category: [{ id: number, name: string }]) => setCategory(category[0]);

    return (
        <>
            { 
                defaultError 
                ?   <Notification 
                        text={ defaultError } 
                        close={ () => setError('') } 
                    /> 
                :   null 
            }

            <Formik 
                initialValues={{ name: '', prise: '', description: '', category: '', image: '' }}
                validationSchema={ ValidateSchema }
                onSubmit={  (values, { resetForm }) => {
                    if (selectedShops.id.length === 0  || !category.name.length) {
                        setError('Заполните пустые поля')
                    }
                    else {
                        const product = {
                            id: Math.floor(Math.random() * 7898359 ) + 1,
                            name: values.name,
                            prise: values.prise,
                            description: values.description,
                            image: values.image,
                            category: category.id,
                            categoryName: category.name,
                            merchantId: selectedShops.id,
                            merchantName: selectedShops.merchantName
                        }
                        mutate({...product}); 
                        resetForm();
                    }
                } }
            >
                { () => (
                    <Form className="form-admin">
                        <div className="space-between flex-start">
                            <div className="multi-fields">
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
                            </div>

                            <div className="multi-fields">
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
                            </div>

                            <div className="multi-fields">
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
                            </div>
                        </div>

                        <div className="max-width">
                            <Multiselect
                                options={ allShops }
                                onSelect={ onSelectShops } 
                                displayValue="merchantName" 
                                placeholder='Выберите магазин'
                                className="form-elem"
                                hidePlaceholder={ true } 
                            />
                        </div>

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

                        <div className="space-between">
                            <div className="max-width space-right">
                                <Multiselect
                                    options={ data }
                                    onSelect={ onSelectCategory } 
                                    displayValue="name" 
                                    placeholder='Выберите категорию'
                                    className="form-elem"
                                    hidePlaceholder={ true } 
                                    selectionLimit={1}
                                />
                            </div>

                            <button 
                                type="submit"
                                className="btn success">
                                    Добавить
                            </button>
                        </div>
                    </Form>
                ) }
            </Formik>
        </>
    )
}

export default AddProductForm
