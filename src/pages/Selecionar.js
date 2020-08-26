import React, { useContext } from 'react';
import "../styles/login.css";
import "../styles/main.css";
import { AuthContext } from '../context/Auth';
import SelecionarTurma from '../components/SelecionarTurma';
import SelecionarEscola from '../components/SelecionarEscola';

export default function Selecionar(){
    const { userDetail: { userInfo } } = useContext(AuthContext);
    if(userInfo.type_access === 'admin' || userInfo.type_access === 'secretário')
    return <SelecionarEscola/>

    else return <SelecionarTurma/>
}