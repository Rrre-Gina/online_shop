import Link from "next/link";
import { useRouter } from "next/router";
import { logout } from "../context/actions";
import { useStoreContext } from "../context/context";

const HeaderAdmin = () => {
    const router = useRouter();
    const { dispatch } = useStoreContext();
    
    return (
        <nav>
            <li>
                <Link href='/admin/profile' className={ router.pathname == "/admin/profile" ? "active" : "" }>
                    Профиль
                </Link>
            </li>
            <li className="dropdown"> 
                <Link 
                    href='/admin/shops' 
                    className={ 
                            router.pathname == "/admin/shops" ? "active" : "" 
                        ||  router.pathname == "/admin/users" ? "active" : ""
                        ||  router.pathname == "/admin/categories" ? "active" : ""
                        ||  router.pathname == "/admin/products" ? "active" : ""
                    }
                >
                    Справочники
                </Link>
                <div className="dropdown-content">
                    <Link href='/admin/shops'>Магазины</Link>
                    <Link href='/admin/users'>Пользователи</Link>
                    <Link href='/admin/categories'>Категории</Link>
                    <Link href='/admin/products'>Товары</Link>
                </div>
            </li>
            <li>
                <Link href='/admin/orders' className={ router.pathname == "/admin/orders" ? "active" : "" }>
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
export default HeaderAdmin