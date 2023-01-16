import { ErrorMessage, Field, Form, Formik } from "formik";
import { useMutation, useQueryClient } from "react-query";
import * as Yup from "yup";
import { CategoryType, CloseFormType } from "../context/types";
import { createCategory } from "../pages/api/categoties.api";


const AddCategoryForm = ({ closeForm }: CloseFormType) => {
    const queryClient = useQueryClient();

    const CreateCategorySchema = Yup.object().shape({
        name: Yup.string()
          .required('Поле обязательно для заполнения')
    });

    const addCategory = useMutation((category: CategoryType) => createCategory(category));
    
    const mutation = async (category: CategoryType) => {
        await addCategory.mutateAsync(category);
        queryClient.invalidateQueries('categories')
    }

    return (
        <Formik 
            initialValues={{ name: '' }}
            validationSchema={ CreateCategorySchema }
            onSubmit={  (values, { resetForm }) => {
                const category = {
                    name: values.name,
                    id: Math.floor(Math.random() * 789859 ) + 1,
                }
                mutation(category);
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
                            placeholder="Укажите название категории"
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

export default AddCategoryForm