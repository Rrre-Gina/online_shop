import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Loader from "./loader";
import { EditUserProps } from "../context/types";
import { useState } from "react";
import { addUserToShop, deleteUserFromShop, getShopsInForm, getUserShop } from "../pages/api/merchants.api";
import * as Yup from "yup";
import { editUser } from "../pages/api/user.api";

const EditUserModal = ({ closeModal, user }: EditUserProps) => {
    const queryClient = useQueryClient();
    const [ shop, setShop ] = useState('');
    const [ changed, setChanged ] = useState(false);
    const [ allShops, setAllShops ] = useState([{ id: '', merchantName: '' }]);

    const ValidateSchema = Yup.object().shape({
        name: Yup.string()
            .required('Поле обязательно для заполнения'),
        email: Yup.string()
            .email('Некорректный email')
            .required('Поле обязательно для заполнения'),
    });
    
    const { mutate, isLoading } = useMutation(
        (info: { data: { name: string, email: string }, id: string }) => editUser(info), 
        {
            onSuccess: () => { 
                closeModal();
                queryClient.invalidateQueries('users'); 
            },
        }
    );

    const getAllShops = useQuery('shops', () => getShopsInForm(setAllShops));

    const getShop = useQuery(
        'managerShop',
        () => getUserShop(setShop, user.role, user.id)
    );

    const editManager = useMutation(async (mutateInfo: { id: string, newRole: string, role: string }) => {
        if (mutateInfo.role === mutateInfo.newRole && changed) {
            deleteUserFromShop(mutateInfo.id);
            addUserToShop(mutateInfo.id, shop);
        }
        else if (mutateInfo.role !== mutateInfo.newRole && mutateInfo.newRole === 'manager') {
            addUserToShop(mutateInfo.id, shop);
        }
        else if (mutateInfo.role !== mutateInfo.newRole && mutateInfo.role === 'manager') {
            deleteUserFromShop(mutateInfo.id);
        }
    });
    
    const managerMutation = async (mutateInfo: { id: string, newRole: string, role: string }) => {
        await editManager.mutateAsync(mutateInfo);
        queryClient.invalidateQueries('users');
    }

    return (
        <div className="background-modal">
            <div className="modal">
                <button 
                    className="modal-close" 
                    onClick={ closeModal } > 
                        &#10006; 
                </button>
                <div className="modal__content">
                    <span className="modal__title">Редактировать пользователя</span>
                    { 
                        isLoading 
                        ?   <div className="loader-background">
                                <Loader />
                            </div> 
                        :    <Formik 
                                initialValues={{ name: user.name, email: user.email, role: user.role }}
                                validationSchema={ ValidateSchema }
                                onSubmit={ (values) => {
                                    const data = {
                                        name: values.name,
                                        email: values.email,  
                                        role: values.role
                                    }
                                    if (values.role === 'manager' || user.role === 'manager') {
                                        managerMutation({ id: user.id, newRole: values.role, role: user.role })
                                        mutate({ data: data, id: user.id });
                                    }
                                    else mutate({ data: data, id: user.id });
                                } }
                            >
                                { (values) => (
                                    <Form className="modal__form">
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
                                            placeholder="Введите email"
                                        />
                                        <ErrorMessage 
                                            name="email" 
                                            className="error-message" 
                                            component="small"
                                        />

                                        <div className="form-admin max-width">
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

                                        { 
                                            values.values.role === 'manager' 
                                            ?   <select 
                                                    name="shops" 
                                                    className="form-elem" 
                                                    onChange={ (e) => { setShop(e.target.value); setChanged(true)} }
                                                    value={ shop }
                                                >
                                                    {
                                                        allShops.map((item: { id: string; merchantName: string }) => 
                                                            <option 
                                                                key={ item.id }
                                                                value={ item.id }>
                                                                    { item.merchantName }
                                                            </option>
                                                        )
                                                    }
                                                </select>
                                            :   null 
                                        }
                                        
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
export default EditUserModal