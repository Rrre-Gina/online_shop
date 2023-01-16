import Link from "next/link";
import { useRouter } from "next/router";
import { logout } from "../context/actions";
import { useStoreContext } from "../context/context";

const HeaderManager = () => {
    const router = useRouter();
    const { dispatch } = useStoreContext();
    
    return (
        <nav>
            <li>
                <Link href='/manager/profile' className={ router.pathname == "/manager/profile" ? "active" : "" }>
                    Профиль
                </Link>
            </li>
            <li>
                <Link href='/manager/shop' className={ router.pathname == "/manager/shop" ? "active" : "" }>
                    Магазин
                </Link>
            </li>
            <li className="dropdown"> 
                <Link 
                    href='/manager/categories' 
                    className={ 
                        router.pathname == "/manager/categories" ? "active" : "" 
                        || router.pathname == "/manager/products" ? "active" : ""
                    }
                >
                    Справочники
                </Link>
                <div className="dropdown-content">
                    <Link href='/manager/categories'>Категории</Link>
                    <Link href='/manager/products'>Товары</Link>
                </div>
            </li>
            <li>
                <Link href='/manager/orders' className={ router.pathname == "/manager/orders" ? "active" : "" }>
                    Заказы
                </Link>
            </li>
            <li>
                <Link href='/auth' onClick={ () => dispatch(logout()) }>
                    Выход
                </Link>
            </li>
        </nav>
    )
}
export default HeaderManager