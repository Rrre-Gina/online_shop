import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CloseFormType, UserType } from "../context/types";
import Notification from "./notification";
import * as Yup from "yup";
import { createUser } from "../pages/api/user.api";
import { addUserToShop, getShopsInForm } from "../pages/api/merchants.api";

const AddUserForm = ({ closeForm }: CloseFormType) => {
    const queryClient = useQueryClient();
    const [ defaultError, setError ] = useState('');
    const [ merchantId, setMerchantId ] = useState('');
    const [ allShops, setAllShops ] = useState([{ id: '', merchantName: '' }]);

    const ValidateSchema = Yup.object().shape({
        name: Yup.string()
            .required('Поле обязательно для заполнения'),
        email: Yup.string()
            .email('Некорректный email')
            .required('Поле обязательно для заполнения'),
        password: Yup.string()
            .required('Поле обязательно для заполнения'),
    });

    const { mutate } = useMutation(
        async (user: UserType) => createUser(user), 
        {
            onSuccess: () => {
                queryClient.invalidateQueries('users');
                closeForm();
            },
            onError: (error: any) => { 
                error.response ? setError(error.response.data) 
                : error.name ? setError(error.name + ': ' + error.message) 
                : setError(error) 
            }
        }
    );

    const addToShop = useMutation(async (value: { id: string, merchantId: string }) => {
        addUserToShop(value.id, value.merchantId)
    });
    
    const mutation = async (value: { id: string, merchantId: string }) => {
        await addToShop.mutateAsync(value);
        queryClient.invalidateQueries('users')
    }

    const getAllShops = useQuery('shops', () => getShopsInForm(setAllShops));

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
                initialValues={{ name: '', email: '', password: '', role: 'customer' }}
                validationSchema={ ValidateSchema }
                onSubmit={  (values, { resetForm }) => {
                    const user = {
                        id: `f${(+new Date()).toString(16)}`,
                        name: values.name,
                        email: values.email,
                        password: values.password,
                        role: values.role
                    }
                    if (values.role === 'manager' && !merchantId.length) {
                        setError('Выберите магазин, к которому относится менеджер')
                    }
                    else if (values.role === 'manager') {
                        mutate({ ...user });
                        mutation({ id: user.id, merchantId })
                    }
                    else mutate({...user}); 
                    resetForm();
                }}
            >
                {(values) => (
                    <Form className="form-admin">
                        <div className="space-between flex-start">
                            <div className="multi-fields">
                                <Field  
                                    type="text" 
                                    name="name" 
                                    className="form-elem space-right" 
                                    placeholder="Укажите имя"
                                />
                                <ErrorMessage 
                                    name="name" 
                                    className="error-message" 
                                    component="small"
                                />
                            </div>

                            <div className="multi-fields">
                                <Field 
                                    type="email" 
                                    name="email" 
                                    className="form-elem space-right" 
                                    placeholder="Укажите email"
                                />
                                <ErrorMessage 
                                    name="email" 
                                    className="error-message" 
                                    component="small"
                                />
                            </div>

                            <div className="multi-fields">
                                <Field 
                                    type="password" 
                                    name="password" 
                                    className="form-elem" 
                                    placeholder="Укажите пароль"
                                />
                                <ErrorMessage 
                                    name="password" 
                                    className="error-message" 
                                    component="small"
                                />
                            </div>
                        </div>

                        <div className="space-between radio-btns">
                            <label>
                                <Field 
                                    type='radio' 
                                    name="role" 
                                    value='customer'
                                /> 
                                Внешний пользователь
                            </label>
                            <label>
                                <Field 
                                    type='radio' 
                                    name="role" 
                                    value='manager'
                                /> 
                                Менеджер магазина
                            </label>
                            <label>
                                <Field 
                                    type='radio' 
                                    name="role" 
                                    value='admin'
                                /> 
                                Администратор
                            </label>
                        </div>
                       
                        <div className="space-between">
                            { 
                                values.values.role === 'manager' 
                                ?   <select name="shops" className="form-elem space-right" onChange={ (e) => setMerchantId(e.target.value) }>
                                    <option value="" hidden>
                                        Выберите магазин, к которому относится менеджер
                                    </option>
                                        {
                                            allShops.map((shop: { id: string; merchantName: string }) => 
                                                <option 
                                                    key={ shop.id }
                                                    value={ shop.id }>
                                                        { shop.merchantName }
                                                </option>
                                            )
                                        }
                                    </select>
                                :   null 
                            }

                            <button 
                                type="submit"
                                className="btn success">
                                    Добавить
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default AddUserForm