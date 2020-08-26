import React, { useState, useContext, useEffect, useRef } from 'react';
import Message from '../components/Message';
import { AuthContext } from '../context/Auth';
import Header from '../components/Header';
import Api from '../services/Api';

export default function Perfil(){
    const [ messageMain, newMessage ] = useState(null);
    const { userDetail, logout, handleInfoUser } = useContext(AuthContext);
    const [infoUser, handleInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [upload, handleUpload] = useState(false);
    const formularioHandleFoto = useRef();
    const inputHandleFoto = useRef();

    useEffect(() => {
        (async () => {
            try {
                const response = await Api.get("/person/myprofile/");
                const { content } = response.data;
                handleInfo(content[0]);
            } catch (error) {
                if(error.response !== undefined) newMessage({ content: error.response.data.message});
                else newMessage({ content: error.message});
            }
            setLoading(false);
        })()
    }, []);

    async function handleFotoPerfil(){
        if(inputHandleFoto.current.value === '') return;
        handleUpload(true);
        try {
            const formulario = new FormData(formularioHandleFoto.current);
            formulario.append('foto_perfil', inputHandleFoto.current.value);
            const response = await Api.post('/foto-perfil/trocar/', formulario);
            const { foto } = response.data;

            handleInfo(infoCurrent => Object.assign(infoCurrent, { foto }));
            handleInfoUser(foto);

            newMessage({ content: 'Foto atualizada com sucesso!', type: 'success'});
        } catch (error) {
            if(error.response !== undefined) newMessage({ content: error.response.data.message});
            else newMessage({ content: error.message});
        }
        handleUpload(false)
    }

    return(
        <>
        <Header/>
        <div className="box-control profile">
            <div className="box-pattern">
                <form ref={formularioHandleFoto}>
                <div className='foto-perfil' style={{ backgroundImage: `url(${userDetail.userInfo.foto || '../assets/icon-person.png'})` }}>
                    <label htmlFor='foto_perfil' className={upload ? 'enviando' : ''}>{ upload ? 'Carregando...' : 'Trocar' }</label>
                    <input
                        type='file'
                        name='foto_perfil'
                        id='foto_perfil'
                        accept='image/png, image/jpeg, image/jpg'
                        ref={inputHandleFoto}
                        onChange={() => handleFotoPerfil()}
                    />
                </div>
                </form>
                {
                    loading ? <h3 style={{ textAlign: 'center', marginTop: 30 }}>Carregando dados...</h3> : 
                    <div className='infoBasic'>
                        <div>
                            {userDetail.userInfo.nome_completo}
                        </div>
                        <div>
                            <span>E-mail</span>
                            {infoUser.email}
                        </div>
                        <div>
                            <span>Data de nascimento</span>
                            {infoUser.data_nascimento}
                        </div>
                        <div>
                            <span>{infoUser.tipo_certidao === 'n' ? "Certidão de nascimento" : "Certidão de Casamento"}</span>
                            {infoUser.number_certidao}
                        </div>
                        <div>
                            <span>CPF</span>
                            {infoUser.cpf}
                        </div>
                        <div>
                            <span>Celular</span>
                            {infoUser.tel}
                        </div>
                        <div>
                            <span>Nome da Mãe</span>
                            {infoUser.nome_mae}
                        </div>
                        <div>
                            <span>Nome do Pai</span>
                            {infoUser.nome_pai}
                        </div>

                    </div>
                }
                <button onClick={() => logout()} className='logout'>sair</button>
            </div>
        </div>
        <Message message={messageMain}/>
        </>
    )
}