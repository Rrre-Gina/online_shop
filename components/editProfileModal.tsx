import { EditModalProps } from "../context/types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "react-query";
import Loader from "./loader";
import { editUser } from "../pages/api/user.api";
import { useState } from "react";
import { addUserToShop, deleteUserFromShop, getShopsInForm, getUserShop } from "../pages/api/merchants.api";

const EditProfileModal = ({ closeModal, userInfo, fetchUserInfo }: EditModalProps) => {
    const [ shop, setShop ] = useState('');
    const [ changed, setChanged ] = useState(false);
    const [ allShops, setAllShops ] = useState([{ id: '', merchantName: '' }]);
    
    const UpdateSchema = Yup.object().shape({
        name: Yup.string()
          .required('Поле не может быть пустым'),
        email: Yup.string()
          .email('Некорректный email')
          .required('Поле не может быть пустым'),
    });

    const { mutate, isLoading } = useMutation(
        (info: { data: { name: string, email: string }, id: string }) => editUser(info), 
        {
            onSuccess: () => { closeModal(); fetchUserInfo() },
            onError: (error: any) => { error.response ? alert(error.response.data) : alert(error) }
        }
    );

    const getAllShops = useQuery('shops', () => getShopsInForm(setAllShops));

    const getManagerShop = useQuery(
        'managerShop',
        () => getUserShop(setShop, userInfo.role, userInfo.id)
    );

    const editManager = useMutation(async (mutateInfo: { id: string }) => {
        deleteUserFromShop(mutateInfo.id);
        addUserToShop(mutateInfo.id, shop);
    });
    
    const managerMutation = async (mutateInfo: { id: string }) => {
        await editManager.mutateAsync(mutateInfo);
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
                    <span className="modal__title">Редактировать данные</span>
                    { 
                        isLoading 
                        ?   <div className="loader-background">
                                <Loader />
                            </div> 
                        :    <Formik 
                                initialValues={{ name: userInfo.name, email: userInfo.email }}
                                validationSchema={ UpdateSchema }
                                onSubmit={ (values) => {
                                    const data = {
                                        name: values.name,
                                        email: values.email,
                                    }
                                    if (changed) {
                                        managerMutation({ id: userInfo.id });
                                        mutate({ data: data, id: userInfo.id });
                                    }
                                    else mutate({ data: data, id: userInfo.id });
                                }}
                            >
                                {() => (
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
                                            placeholder="Введите логин"
                                        />
                                        <ErrorMessage 
                                            name="email" 
                                            className="error-message" 
                                            component="small"
                                        />
                                        
                                        {
                                            userInfo.role === 'manager'
                                            ?   <select 
                                                    name="shops" 
                                                    className="form-elem" 
                                                    onChange={ (e) => { setShop(e.target.value); setChanged(true) } }
                                                    value={ shop }
                                                >
                                                    {
                                                        allShops?.map((item: { id: string; merchantName: string }) => 
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
                                )}
                            </Formik>
                    }
                </div>
            </div>
        </div>
    )
}
export default EditProfileModal