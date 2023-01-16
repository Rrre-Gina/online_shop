type Props = {
    text: string,
    close: () => void
}

const Notification = ({ text, close } :Props) => { 
    return (
        <div className="notification" data-testid='notification'>
            <button 
                className="modal-close" 
                onClick={ () => close() }> 
                    &#10006; 
            </button>
            { text }
        </div>
    )
}
export default Notification