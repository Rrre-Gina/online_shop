import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import Loader from "./loader";
import { EditCategoryProps } from "../context/types";
import { editCategory } from "../pages/api/categoties.api";

const EditCategoryModal = ({ closeModal, category }: EditCategoryProps) => {
    const queryClient = useQueryClient();
    
    const UpdateSchema = Yup.object().shape({
        name: Yup.string()
          .required('Поле не может быть пустым')
    });

    const { mutate, isLoading } = useMutation(
        async (data: { id: number, name: string }) => editCategory(data), 
        {
            onSuccess: () => { closeModal(), queryClient.invalidateQueries('categories')},
        }
    );

    return (
        <div className="background-modal">
            <div className="modal">
                <button 
                    className="modal-close" 
                    onClick={ closeModal } > 
                        &#10006; 
                </button>
                <div className="modal__content">
                    <span className="modal__title">Редактировать категорию</span>
                    { 
                        isLoading 
                        ?   <div className="loader-background">
                                <Loader />
                            </div> 
                        :    <Formik 
                                initialValues={{ name: category.name }}
                                validationSchema={ UpdateSchema }
                                onSubmit={ (values) => {
                                    const data = {
                                        id: category.id,
                                        name: values.name
                                    }
                                    mutate(data)
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
export default EditCategoryModal