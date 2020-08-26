import React, { useState, useEffect, useContext } from 'react';
import iconClose from '../assets/icon-close.svg';
import Api from '../services/Api';
import { dateOnly, dateCurrent } from './Date';
import { AuthContext } from '../context/Auth';

export default function ModalComentario({id_atividade, closeModal = () =>{}}){
    const [comentario, handleComentario] = useState('');
    const [ listComentarios, handleListComentarios ] = useState([]);
    const [ message, handleMessage ] = useState('Carregando comentários!');
    const [salvando, handleSalvando] = useState(false);
    const { userDetail: { userInfo } } = useContext(AuthContext);

    function onClose(event){
        event.preventDefault();
        closeModal();
    }    

    async function onSubmit(event){
        event.preventDefault();

        if(salvando) return handleMessage({ content: 'Estamos salvando ainda...', type: 'success' })

        handleSalvando(true)

        try {
            const join_data = { 
                comentario,
                atividade: id_atividade }
        
            const response = await Api.post('/comentario/create/', join_data)
            const { idRegistro } = response.data;

            handleListComentarios(prevList => [...prevList, {
                id: idRegistro,
                comentario: comentario,
                created_at: dateCurrent(),
                foto: userInfo.foto,
                nome_completo: userInfo.nome_completo
            }])

            handleComentario('');

        } catch (error) {
            if(error.response !== undefined) handleMessage(error.response.data.message)
            else handleMessage(error.message)
        }

        handleSalvando(false);
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await Api.get(`/comentario/list/${id_atividade}`);
                const { content } = response.data;
                if(!content.length) handleMessage('Nenhum comentário encontrado!')
                else handleListComentarios(content);

            } catch (error) {
                if(error.response !== undefined) handleMessage(error.response.data.message)
                else handleMessage(error.message)
            }
        })()
    }, [id_atividade])

    return(
        <div className={`modal-bg`}>
            <div className='box-content-modal'>
                <form>
                    <div className='header-modal'>
                        <div className='closeTitle'>
                            <button onClick={event => onClose(event)} className='btnClose'>
                                <img src={iconClose} alt=''/>
                            </button>
                            <h2 className='title'>Comentários</h2>
                        </div>
                        <button className='salvar' onClick={event => onSubmit(event)}>{ salvando ? 'Salvando' : 'Comentar' }</button>
                    </div>
                    <div className='content' style={{ overflowY: 'hidden' }}>
                        <div className='box-field'>
                            <textarea name='comentario' id='comentario' maxLength='500' value={comentario} placeholder='Escreva seu comentário aqui' required onChange={content => handleComentario(content.target.value)}/>
                        </div>
                    </div>
                    <div className='content' style={{ minHeight: 200, maxHeight: 300 }}>
                        {
                            !listComentarios.length ? <h3 style={{ textAlign: 'center' }}>{ message }</h3> :
                            listComentarios.map(({ id, foto, nome_completo, created_at, comentario }) => {
                                return (
                                    <div className='box-comment' key={id}>
                                        <div className='foto_perfil_comentario'>
                                            <div id='foto' style={{ backgroundImage: `url(${foto})` }}/>
                                            <div className='nome_data'>
                                                <span className='destak'>{ nome_completo }</span>
                                                <span>{ dateOnly(created_at) }</span>
                                            </div>
                                        </div>
                                        <div className='comentario'>{ comentario }</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}