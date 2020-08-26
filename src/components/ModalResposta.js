import React, { useState, useEffect, useRef } from 'react';
import iconClose from '../assets/icon-close.svg';
import Api from '../services/Api';

export default function ModalTurma({atividade, closeModal = () =>{},  Message = () => {}}){
    const [dataResposta, handleDataResposta] = useState({});
    const [loading, handleLoading] = useState(true);
    const fileInput = useRef();
    const formUpload = useRef();
    const [salvando, handleSalvar] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const response = await Api.get(`/resposta/list/i/${atividade}`);
                const { content } = response.data;

                if(content.length) handleDataResposta(prevList => Object.assign(prevList, content[0]))

            } catch (error) {
                if(error.response) Message({ content: error.response.data.message })
                else Message({ content: error.message })
            }
            handleLoading(false)
        })()
    }, [Message, atividade])

    async function onSubmit(){
        if(salvando){
            Message({ content: 'Estamos enviando a resposta, aguarde...', type:'success' })
            return;
        }

        handleSalvar(true)
        try {
            const formulario = new FormData(formUpload.current);
            formulario.append('file_resposta', fileInput.current.value);
            formulario.append('atividade', atividade);

            const response = await Api.post('/resposta/create/', formulario);
            const { message } = response.data

            Message({ content: message, type: 'success' })
            closeModal();

        } catch (error) {
            if(error.response !== undefined) Message({ content: error.response.data.message })
            else Message({ content: error.message })
        }

        handleSalvar(false);
    }

    return(
        <div className={`modal-bg`}>
            <div className='box-content-modal'>
                <div className='header-modal'>
                    <div className='closeTitle'>
                        <button onClick={() => closeModal()} className='btnClose'>
                            <img src={iconClose} alt=''/>
                        </button>
                        <h2 className='title'>Sua Resposta</h2>
                    </div>
                    {
                        loading ? <></> : 
                        dataResposta.link_resposta !== undefined ? <></> :
                        <button className='salvar' onClick={() => onSubmit()}>{ salvando ? 'Salvando' : 'Salvar' }</button>
                    }
                </div>
                {
                    loading ? <h2>Buscando resposta...</h2> : 
                        
                    dataResposta.link_resposta === undefined ? 
                    <form ref={formUpload}>
                        <div className='content'>
                            <div className='escolha-file'>
                                <label htmlFor="file_resposta">Escolher arquivo</label>
                                <input
                                    type='file'
                                    name='file_resposta'
                                    id='file_resposta'
                                    required
                                    ref={fileInput}
                                    />
                            </div>
                        </div>
                    </form>
                    
                    :

                    <div className='content respondido'>
                        <button className='verImagem'>
                            <a href={dataResposta.link_resposta} target="_blank" rel="noopener noreferrer">
                                Ver imagem de resposta
                            </a>
                        </button>
                        <div>Sua nota é <span>{dataResposta.nota || '---'}</span></div>
                        <div>
                            <span>Avaliador</span>
                            { dataResposta.nome_avaliador || "---" }
                        </div>
                        <div>
                            <span>Comentário do avaliador</span>
                            { dataResposta.comment_avaliador || "" }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}