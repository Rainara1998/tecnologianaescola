import React,{ useContext } from 'react';
import '../styles/main.css';
import HeaderAdmin from '../components/HeaderAdmin';
import { AuthContext } from '../context/Auth';

export default function AreaManager (){
    const { userDetail: { userInfo } } = useContext(AuthContext);
    return (
        <>
        <HeaderAdmin/>
        <div className="box-control">
            <div className="box-pattern">
                <div className='headerInitial'>
                    <span>
                        Seja muito bem vindo(a)
                    </span>
                    <h2>
                        {userInfo.nome_completo}
                    </h2>
                </div>
            </div>
        </div>
        </>
    )
}