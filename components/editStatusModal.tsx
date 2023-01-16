import { useMutation, useQueryClient } from "react-query";
import Loader from "./loader";
import { EditStatusProps } from "../context/types";
import { useState } from "react";
import { changeOrderStatus } from "../pages/api/orders.api";

const EditStatusModal = ({ closeModal, status, id }: EditStatusProps) => {
    const queryClient = useQueryClient();
    const [ newStatus, setNewStatus ] = useState(status);

    const changeStatus = useMutation(async (mutateInfo: { id: string, newStatus: string }) => changeOrderStatus(mutateInfo));

    const mutation = async (mutateInfo: { id: string, newStatus: string }) => {
        await changeStatus.mutateAsync(mutateInfo);
        closeModal();
        queryClient.invalidateQueries('orders');
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
                    <span className="modal__title">Сменить статус</span>
                    { 
                        <div>
                            <select 
                                name="shops" 
                                className="form-elem space-right" 
                                value={ newStatus }
                                onChange={ (e) => setNewStatus(e.target.value) }
                            >
                                <option value={'Создан'}>
                                    Создан
                                </option>
                                <option value={'Отправлен'}>
                                    Отправлен
                                </option>
                                <option value={'Закрыт'}>
                                    Закрыт
                                </option>
                            </select>
                                        
                            <button 
                                type="submit" 
                                className="success form-elem btn"
                                onClick={ () => mutation({ id: id, newStatus: newStatus }) }> 
                                    Сохранить 
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
export default EditStatusModal