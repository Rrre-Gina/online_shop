import { ErrorMessage, Field, Form, Formik } from "formik";
import { useMutation, useQueryClient } from "react-query";
import * as Yup from "yup";
import { CloseFormType, ShopType } from "../context/types";
import { createShop } from "../pages/api/merchants.api";


const AddShopForm = ({ closeForm }: CloseFormType) => {
    const queryClient = useQueryClient();

    const ValidationSchema = Yup.object().shape({
        name: Yup.string()
          .required('Поле обязательно для заполнения')
    });

    const addShop = useMutation((shop: ShopType) => createShop(shop));
    
    const mutation = async (shop: ShopType) => {
        await addShop.mutateAsync(shop);
        queryClient.invalidateQueries('shops')
    }

    return (
        <Formik 
            initialValues={{ name: '' }}
            validationSchema={ ValidationSchema }
            onSubmit={  (values, { resetForm }) => {
                const shop = {
                    id: `${(+new Date()).toString(16)}`,
                    merchantName: values.name,
                    merchantUsers: []
                }
                mutation(shop);
                resetForm();
                closeForm();
            }}
        >
            {() => (
                <Form className="form-admin">
                    <div className="space-between">
                        <Field 
                            type="text" 
                            name="name" 
                            className="form-elem" 
                            placeholder="Укажите название магазина"
                        />
                        <button 
                            type="submit"
                            className="btn success product__info">
                                Добавить
                        </button>
                    </div>

                    <ErrorMessage 
                        name="name" 
                        className="error-message" 
                        component="small"
                    />
                </Form>
            )}
        </Formik>
    )
}

export default AddShopForm