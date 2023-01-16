import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { logout } from "../context/actions";
import { useStoreContext } from "../context/context";

const Header = () => {
    const router = useRouter();
    const { state, dispatch } = useStoreContext();
    const [ authorized, setAuthorized ] = useState(false);
    useEffect(() => { state.userToken ? setAuthorized(true) : null }, [state.userToken]);
    
    return (
        <nav>
            <li> 
                <Link href='/' className={ router.pathname == "/" ? "active" : "" }>
                    Главная
                </Link>
            </li>
            <li> 
                <Link href='/categories' className={ router.pathname == "/categories" ? "active" : "" }>
                    Категории
                </Link>
            </li>
            <li>
                <Link href='/cart' className={ router.pathname == "/cart" ? "active" : "" }>
                    Корзина
                </Link>
            </li>
            {
                !authorized 
                ?   <li> 
                        <Link href='/auth' onClick={ () => dispatch(logout()) }>Войти</Link>
                    </li>
                :   <li className="dropdown"> 
                        <Link href='/profile' className={ router.pathname == "/profile" ? "active" : "" }>
                            Профиль
                        </Link>
                        <div className="dropdown-content">
                            <Link href='/profile'>Профиль</Link>
                            <Link href='/auth' onClick={ () => dispatch(logout()) }>Выход</Link>
                        </div>
                    </li>
            }
        </nav>
    )
}
export default Header