import React, { useState, useContext } from 'react';
import Logo from '../assets/logo-transparent.png';
import { Link, useHistory } from 'react-router-dom';
import iconAdd from '../assets/icon-add-colored.svg';
import { AuthContext } from '../context/Auth';
import { EscolaContext } from '../context/Escola';

export default function Header({add, openModal = () => {}}){
    const [openMenu, setOpenMenu] = useState(false);
    const { userDetail: { userInfo} } = useContext(AuthContext);
    const { infoEscola } = useContext(EscolaContext);
    const HistoryNavigator = useHistory();

    if(userInfo.type_access !== 'admin'){
        return <></>
    }

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
                            <Link to={`/gerenciar/${infoEscola.id}/escolas`}>
                                Escolas
                            </Link>
                        </div>
                        <div className="linksNavMenu">
                            <Link to={`/gerenciar/${infoEscola.id}/pessoas/`}>
                                Pessoas
                            </Link>
                        </div>
                        {
                            userInfo.type_access !== 'admin' ? <></> :
                            <div className="linksNavMenu">
                                <Link to={`/administradores`}>
                                    Administradores
                                </Link>
                            </div>
                        }
                        <div className="linksNavMenu">
                            <Link to={`/gerenciar/${infoEscola.id}/turmas/`}>
                                Turmas
                            </Link>
                        </div>
                        <div className="linksNavMenu">
                            <Link to={`/gerenciar/${infoEscola.id}/enturmar/`}>
                                Enturmar
                            </Link>
                        </div>
                    </nav>
                </div>
                <div className="logo">
                    <img src={Logo} alt=""/>
                    <div className="titleMain" style={{ cursor: 'pointer'}} onClick={() => HistoryNavigator.push(`/gerenciar/${infoEscola.id}`)}>
                        <div className="titleSmall">Tecnologia na escola</div>
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
                    <img src={require('../assets/icon-turma.svg')} alt=""/>
                    <div>
                        Trocar Escola
                    </div>
                </button> 
                <button className="profile" onClick={() => HistoryNavigator.push('/perfil')}>
                    <img src={userInfo.foto} alt=""/>
                </button>
            </div>
        </header>
    )
}