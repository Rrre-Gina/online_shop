import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup";
import { UserType } from '../context/types';
import Loader from '../components/loader';
import Notification from '../components/notification';
import { createUser } from './api/user.api';

const Registration = () => {
    const router = useRouter();
    const [ defaultError, setError ] = useState('');

    const RegistrationSchema = Yup.object().shape({
        name: Yup.string()
          .required('Поле обязательно для заполнения'),
        password: Yup.string()
          .required('Поле обязательно для заполнения'),
        email: Yup.string()
          .email('Некорректный email')
          .required('Поле обязательно для заполнения'),
    });

    const { mutate, isLoading } = useMutation(
        (data: UserType) => createUser(data), 
        {
            onSuccess: () => router.push('/auth'),
            onError: (error: any) => { 
                error.response ? setError(error.response.data) 
                : error.name ? setError(error.name + ': ' + error.message) 
                : setError(error) 
            }
        }
    );
    

    return (
        <div className="form">
            { 
                defaultError 
                ?   <Notification 
                        text={ defaultError } 
                        close={ () => setError('') } 
                    /> 
                :   null 
            }
            <h3>Регистрация</h3>
            <Formik 
                initialValues={{ name: '', email: '', password: '' }}
                validationSchema={ RegistrationSchema }
                onSubmit={ (values) => {
                    const data = {
                        'email': values.email,
                        'password': values.password,
                        'id': `f${(+new Date()).toString(16)}`,
                        'name': values.name,
                        'role': 'customer'
                    }
                    mutate({ ...data })
                }}
            >
                {() => (
                    isLoading 
                    ?   <div className="loader-background">
                            <Loader />
                        </div> 
                    :   <Form>
                            <Field 
                                type="text" 
                                name="name" 
                                className="form-elem" 
                                placeholder="Введите имя"
                            />
                            <ErrorMessage 
                                name="name" 
                                className="error-message" 
                                component="small"
                            />

                            <Field 
                                type="email" 
                                name="email" 
                                className="form-elem" 
                                placeholder="Введите логин"
                            />
                            <ErrorMessage 
                                name="email" 
                                className="error-message" 
                                component="small"
                            />

                            <Field 
                                type="password" 
                                name="password" 
                                className="form-elem" 
                                placeholder="Введите пароль"
                            />
                            <ErrorMessage 
                                name="password" 
                                className="error-message" 
                                component="small"
                            />

                            <button 
                                type="submit" 
                                className="success form-elem btn"> 
                                    Зарегистрироваться 
                            </button>
                        </Form>
                )}
            </Formik>
        </div>
    )
}
export default Registration