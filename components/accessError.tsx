import Link from "next/link";

const AccessError = () => {
    return (
        <p className="need-auth need_access">
            Нет доступа к этой странице. 
            <br />
            Перейти на страницу <Link href='/auth'> авторизации </Link> 
        </p>
    )
}
export default AccessError