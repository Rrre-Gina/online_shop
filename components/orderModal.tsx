import { OrderProps, OrderType } from "../context/types";
import { useState } from "react";
import { clearCart } from "../context/actions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Loader from "./loader";
import Notification from "./notification";
import { useStoreContext } from "../context/context";
import { useMutation } from "react-query";
import { createOrder } from "../pages/api/orders.api";

const OrderModal = ({ closeModal, productsInfo, sum }: OrderProps) => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const { dispatch } = useStoreContext();
    const [error, setError] = useState('');
    
    const OrderSchema = Yup.object().shape({
        address: Yup.string()
            .required('Поле не может быть пустым'),
        phone: Yup.string()
            .max(12, 'Некорректный формат')
            .min(12, 'Некорректный формат')
            .required('Поле не может быть пустым'),
        date: Yup.string()
            .max(10, 'Некорректная дата')
            .required('Поле не может быть пустым')
    });

    const { mutate, isLoading } = useMutation(
        (data: OrderType) => createOrder(data), 
        {
            onSuccess: () => { closeModal(); dispatch(clearCart()) },
            onError: (error: any) => { setError(error.name + ' ' + error.message) }
        }
    );

    return (
        <div className="background-modal">
            { 
                error.length 
                ?   <Notification 
                        text={ error + ', попробуйте еще раз' } 
                        close={ () => setError('')} 
                    /> 
                :   null 
            }
            <div className="modal">
                <button 
                    className="modal-close" 
                    onClick={ closeModal }> 
                        &#10006; 
                </button>
                <div className="modal__content">
                    <span className="modal__title">Детали заказа</span>
                    {   
                        isLoading 
                        ?   <div className="loader-background">
                                <Loader /> 
                            </div>
                        :   <Formik 
                                initialValues={{ address: '', phone: '', date: '', payPath: 'Наличными' }}
                                validationSchema={ OrderSchema }
                                onSubmit={ (values) => {
                                    const data = {
                                        id: `f${(+new Date()).toString(16)}`,
                                        address: values.address,
                                        date: values.date.split('-').reverse().join("."),
                                        phone: values.phone,
                                        pay: values.payPath,
                                        status: 'Создан',
                                        orderProducts: productsInfo,
                                        userId: userId!,
                                        sum: sum,
                                    };
                                    mutate({...data})
                                }}
                            >
                                {() => (
                                    <Form className="modal__form">
                                        <Field 
                                            type="text" 
                                            name="address" 
                                            className="form-elem" 
                                            placeholder="Адрес доставки"
                                        />
                                        <ErrorMessage 
                                            name="address" 
                                            className="error-message" 
                                            component="small"
                                        />
                                        
                                        <Field 
                                            type="date" 
                                            name="date" 
                                            className="form-elem"
                                            placeholder="Укажите дату"
                                        />
                                        <ErrorMessage 
                                            name="date" 
                                            className="error-message" 
                                            component="small"
                                        />
                                        
                                        <Field 
                                            type="text" 
                                            name="phone" 
                                            className="form-elem" 
                                            placeholder="+7 700 700 70 70"
                                        />
                                        <ErrorMessage 
                                            name="phone" 
                                            className="error-message" 
                                            component="small"
                                        />
                                        
                                        <label className="form-label">Способ оплаты</label>
                                        <div className="space-between">
                                            <label>
                                                <Field 
                                                    type='radio' 
                                                    name="payPath" 
                                                    value='Наличными'
                                                /> 
                                                Наличными
                                            </label>
                                            <label>
                                                <Field 
                                                    type='radio' 
                                                    name="payPath" 
                                                    value='Картой'
                                                /> 
                                                Картой
                                            </label>
                                        </div>
                                        <ErrorMessage 
                                            name="payPath"
                                            className="error-message" 
                                            component="small"
                                        />
                                        
                                        <button 
                                            type="submit" 
                                            className="success form-elem btn"> 
                                                Сохранить 
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                    }
                </div>
            </div>
        </div>
    )
}
export default OrderModal