import React from 'react';
import { AuthContext } from '../context/Auth';

export default function List({dataList, removeItem = () => {} }){
    const { userDetail: { userInfo } } = React.useContext(AuthContext);
    return(
        <li>
            <a href={dataList.link} target="_blank" rel="noopener noreferrer">
                { dataList.link.length > 40 ? `${dataList.link.substring(0,40)}...` : dataList.link }
            </a>
            {
                userInfo.type_access === 'aluno' ? <></> : 
                <button onClick={() => removeItem(dataList.id)}>
                    <img src={require("../assets/icon-close.svg")} alt=''/>
                </button>
            }
        </li>
    )
}