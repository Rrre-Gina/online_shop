import React from 'react';

type Pagination = {
    page: number, 
    length: number,
    prevPage: () => void,
    nextPage: () => void
}

const Pagination = ({ page, length, prevPage, nextPage }: Pagination) => {
    
    return (
        <div className="counter center">
            <button 
                className="counter__btn pagination_btn"
                onClick={ page > 1 ? prevPage : () => null } disabled={ page <= 1 }>
                    &#11160;
            </button>
            <span>{ page }</span>
            <button 
                className="counter__btn pagination_btn"
                onClick={ nextPage } disabled={ length < 10 }>
                    &#11162;
            </button>
        </div>
    )
}
export default Pagination