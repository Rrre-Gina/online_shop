import axios from "axios";
import { setUserInfo } from "../../context/actions";
import { UserType } from "../../context/types";

const userUrl = 'http://localhost:3003/users';
const loginUrl = 'http://localhost:3003/login';

export const fetchUserData = async (page: number) => 
    await axios.get(`${ userUrl }?_page=${ page }&_limit=10`)
        .then(res => res.data.reverse());

export const createUser = async (data: UserType) => 
    await axios.post(userUrl, data);

export const deleteUser = async (id: string) => 
    await axios.delete(`${ userUrl }/${ id }`);

export const editUser = async (info: { data: { name: string, email: string }, id: string }) => 
    await axios.patch(`${ userUrl }/${ info.id }`, info.data);

export const getUser = async (userId: string | null) => 
    await axios.get(`${ userUrl }/${ userId }`).then(res => res.data);

export const auth = async (info: { data: { email: string, password: string }, dispatch: any, userPath: (role: string) => void }) => {
    await axios.post(loginUrl, info.data)
        .then(response => {
            const getUserInfo = async() => {
                const user = await axios.get(`${ userUrl }/${ response.data.user.id }`);

                const userInfo = {
                    id: response.data.user.id,
                    token: response.data.accessToken,
                    role: user.data.role
                }
                
                info.dispatch(setUserInfo(userInfo));
                info.userPath(userInfo.role);
            }
            getUserInfo();
        })
};

export const getUserName = async (users: string[], setShopUsersName: (data: string[]) => void) => {
    const names: string[] = [];
    for (let i = 0; i < users.length; i++) {
        names[i] = await axios.get(`${ userUrl }/${ users[i] }`).then(res => res.data.name)
    };
    setShopUsersName(names);
}

export const handleSearchUser = async (text: string, setUsers: (data: any) => void) =>
    await axios.get(`${ userUrl }?q=${ text }`)
        .then(res => setUsers(res.data.reverse()));
