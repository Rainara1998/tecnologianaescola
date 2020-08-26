import React,{ createContext, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Api from '../services/Api';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const HistoryNavigator = useHistory();
    const LocationNavigator = useLocation();
    const [loading, setLoading] = useState(true);
    const [userDetail, setUserDetail] = useState({
        isAuthenticate: false,
        userInfo: {}
    });

    useEffect(() => {
        const info = localStorage.getItem('a');

        if(info){
            const { token, content: userInfo } = JSON.parse(info);
            Api.defaults.headers.auth = token;
            setUserDetail({
                isAuthenticate: true,
                userInfo: userInfo
            })
        }
        setLoading(false)
    },[])

    function signIn(content, redirectFrom ){
        Api.defaults.headers.auth = content.token
        localStorage.setItem('a', JSON.stringify(content));

        setUserDetail({
            isAuthenticate: true,
            userInfo: content.content
        })

        if(redirectFrom === 'codigo'){ return HistoryNavigator.push('/alterar-senha/');}
        if(content.content.primeiro_acesso){ return HistoryNavigator.push('/alterar-senha/');}

        const { from } = LocationNavigator.state || { from: { pathname: '/'} }
        HistoryNavigator.replace(from);
    }

    function logout(){
        setUserDetail({
            isAuthenticate: false,
            token: null,
            userInfo: null
        })
        
        localStorage.removeItem('a');
        localStorage.removeItem('infoTurma');
        localStorage.removeItem('infoEscola');

        HistoryNavigator.push('/login')
    }

    function handleInfoUser(newFoto){
        const dataStorage = localStorage.getItem('a');
        const { token, content } = JSON.parse(dataStorage);
        const join_data = {
            token: token,
            content: Object.assign(content, { foto: newFoto })
        }

        localStorage.setItem('a', JSON.stringify(join_data));

        setUserDetail({
            isAuthenticate: true,
            userInfo: join_data.content
        })
    }

    function alterarPrimeiroAcesso(){
        const dataStorage = localStorage.getItem('a');
        const { token, content } = JSON.parse(dataStorage);
        const join_data = {
            token,
            content: Object.assign(content, { primeiro_acesso: false })
        }

        localStorage.setItem('a', JSON.stringify(join_data));

        setUserDetail({
            isAuthenticate: true,
            userInfo: join_data.content
        })

        HistoryNavigator.push('/')
    }

    if(loading)
    return (<h1>Carregando...</h1>)


    return(
        <AuthContext.Provider value={{ userDetail, signIn, logout, handleInfoUser, alterarPrimeiroAcesso }}>
            { children }
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }