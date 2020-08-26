import React, { useState, useContext } from 'react';
import Logo from '../assets/logo-transparent.png';
import iconTurma from '../assets/icon-turma.svg';
import { Link, useHistory } from 'react-router-dom';
import iconAdd from '../assets/icon-add-colored.svg';
import { AuthContext } from '../context/Auth';
import { TurmaContext } from '../context/Turma';
import HeaderAdmin from './HeaderAdmin';

export default function Header({add = false, openModal = () => {}}){
    const [openMenu, setOpenMenu] = useState(false);
    const { userDetail : { userInfo } } = useContext(AuthContext);
    const { infoTurma } = useContext(TurmaContext);
    const HistoryNavigator = useHistory();

    if(userInfo.type_access === 'admin' || userInfo.type_access === 'secretário')
    return <HeaderAdmin add={add} openModal={() => openModal()}/>

    return(
        <header className="headerPages">
            <div className="menu-logo">
                <div className="menu">
                    <button className="btnMenu" onClick={() => {setOpenMenu(!openMenu)}}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </button>
                    <nav className={`navMenu ${openMenu ? 'navMenuOpen' : ''}`}>
                        <div className="linksNavMenu">
                            <Link to={`/sala/${infoTurma.turma_id}/pessoas`}>
                                Pessoas
                            </Link>
                        </div>
                    </nav>
                </div>
                <div className="logo">
                    <img src={Logo} alt=""/>
                    <div className="titleMain" style={{ cursor: 'pointer'}} onClick={() => HistoryNavigator.push(`/sala/${infoTurma.turma_id}`)}>
                        <div className="titleSmall">{ infoTurma.nome_turma } - { infoTurma.turno }</div>
                    </div>
                </div>
            </div>
            <div className="turma-profile">
                {
                    !add ? <></> : 
                    <button className='addHeader' onClick={() => openModal()}>
                        <img src={iconAdd} alt=''/>
                    </button>
                }
                <button className="handle-turma" onClick={() => HistoryNavigator.push('/')}>
                    <img src={iconTurma} alt=""/>
                    <div>
                        Trocar turma
                    </div>
                </button> 
                <button className="profile" onClick={() => HistoryNavigator.push('/perfil')}>
                    <img src={userInfo.foto} alt=""/>
                </button>
            </div>
        </header>
    )
}