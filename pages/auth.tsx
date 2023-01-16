import { useState } from "react";
import * as Yup from "yup";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import Loader from "../components/loader";
import Notification from "../components/notification";
import { auth } from "./api/user.api";
import { useStoreContext } from "../context/context";

const Login = () => {
    const router = useRouter();
    const [ defaultError, setError ] = useState('');
    const { dispatch } = useStoreContext();

    const SignupSchema = Yup.object().shape({
        password: Yup.string()
          .required('Поле обязательно для заполнения'),
        email: Yup.string()
          .email('Некорректный email')
          .required('Поле обязательно для заполнения'),
    });

    const userPath = (role: string) => {
        role === 'admin' ? router.push('/admin/profile') 
        : role === 'customer' ? router.push('/')
        : router.push('/manager/profile')
    };

    const { mutate, isLoading } = useMutation(
        (info: { data: { email: string, password: string }, dispatch: any, userPath: (role: string) => void }) => auth(info),
        {
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
            <h3>Авторизация</h3>
            { 
                isLoading 
                ?   <div className="loader-background">
                        <Loader />
                    </div> 
                :   <Formik 
                        initialValues={{ email: '', password: '' }}
                        validationSchema={ SignupSchema }
                        onSubmit={ (values) => {
                            const data = {
                                'email': values.email,
                                'password': values.password,
                            }
                            mutate({ data: data, dispatch: dispatch, userPath: (role: string) => userPath(role) });
                        }}
                    >
                        {() => (
                            <Form>
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
                                        Войти 
                                </button>
                                <Link href='/registration' className="form-link">Зарегистрироваться</Link>
                            </Form>
                        )}
                    </Formik>
            }
        </div>
    )
}
export default Login