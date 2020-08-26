import React, { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AuthContext } from './context/Auth';

import Login from './pages/Login';
import CodigoNovaSenha from './pages/CodigoNovaSenha';
import AlterarSenha from './pages/AlterarSenha';
import Sala from './pages/Sala';
import Atividades from './pages/Atividades';
import Selecionar from './pages/Selecionar';
import PessoaPorEscola from './pages/Pessoas';
import Perfil from './pages/Perfil';
import Avaliar from './pages/Avaliar';

import GerenciarInitial from './pages/GerenciarInitial';
import Pessoas from './pages/Manager/Pessoas';
import Escolas from './pages/Manager/Escolas';
import Admin from './pages/Manager/Admin';
import Turmas from './pages/Manager/Turmas';
import Materias from './pages/Manager/Materias';
import Enturmar from './pages/Manager/Enturmar';

import NotFound from './pages/NotFound';

const CustomRouter = ({ component: Component, ...rest }) => {
    const { userDetail: { isAuthenticate } } = useContext(AuthContext);

    return (
        <Route
          {...rest}
          render={({ location }) =>
            isAuthenticate ? (
              <Component/>
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: location }
                }}
              />
            )
          }
        />
    );
}

export default function RouterPages(){
    return(
        <Switch>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/codigo/senha-nova/' component={CodigoNovaSenha}/>
            <CustomRouter exact path='/alterar-senha/' component={AlterarSenha}/>
            <CustomRouter exact path='/' component={Selecionar}/>
            <CustomRouter exact path='/sala/:turma_id' component={Sala}/>
            <CustomRouter exact path='/sala/:turma_id/materia/:materia_id' component={Atividades}/>
            <CustomRouter exact path='/perfil' component={Perfil}/>
            <CustomRouter exact path='/sala/:turma_id/pessoas' component={PessoaPorEscola}/>
            <CustomRouter exact path='/sala/:turma_id/materia/:materia_id/atividade/:atividade_id/avaliar/' component={Avaliar}/>

            <CustomRouter exact path='/gerenciar/:escola_id' component={GerenciarInitial}/>
            <CustomRouter exact path='/gerenciar/:escola_id/pessoas/' component={Pessoas}/>
            <CustomRouter exact path='/gerenciar/:escola_id/escolas' component={Escolas}/>
            <CustomRouter exact path='/administradores' component={Admin}/>
            <CustomRouter exact path='/gerenciar/:escola_id/turmas/' component={Turmas}/>
            <CustomRouter exact path='/gerenciar/:escola_id/turmas/:turma_id/materias/' component={Materias}/>
            <CustomRouter exact path='/gerenciar/:escola_id/enturmar/' component={Enturmar}/>

            <CustomRouter path='*' component={NotFound}/>
        </Switch>
    )
}