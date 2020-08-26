import React, { useState, useRef } from 'react';
import iconClose from '../assets/icon-close.svg';
import Input from './Input';
import Api from '../services/Api';

export default function ModalTurma({ atividade, closeModal = () =>{}, Message = () => {}}){
    const [dataForm, setDataForm] = useState({});
    const fileInput = useRef();
    const formunarioRef = useRef();
    const [usarLink, handleUsarLink] = useState(false);
    const [salvando, handleSalvar] = useState(false);

    function handleDataForm(content){
        const newData = Object.assign(dataForm,content);
        setDataForm(newData);
    }

    function onClose(event){
        event.preventDefault();
        closeModal();
    }

    async function saveComArquivo(){
        try {
            const formulario = new FormData(formunarioRef.current);
            formulario.append('file_anexo', fileInput.current.value);
            formulario.append('atividade', atividade);
            const response = await Api.post('/anexo/create/file', formulario);
            const { idRegistro, link } = response.data;
            const content = {
                id: idRegistro,
                link,
                atividade
            }
            closeModal(content);

        } catch (error) {
            if(error.response) Message({ content: error.response.data.message })
            else Message({ content: error.message })
        }
    }

    async function saveComLink(){
        try {
            const join_data = Object.assign(dataForm, { atividade: atividade })
            const response = await Api.post('/anexo/create/', join_data);
            const { idRegistro } = response.data;
            const content = Object.assign(join_data, { id: idRegistro })
            closeModal(content);
        } catch (error) {
            if(error.response) Message({ content: error.response.data.message })
            else Message({ content: error.message })
        }

    }

    async function onSubmit(event){
        event.preventDefault();

        if(usarLink && dataForm.link === '') return Message({ content: 'Você precisa adicionar um link!' });

        if(!usarLink && fileInput.current.value === '') return Message({ content: 'Você precisa selecionar um arquivo!' });

        if(salvando) return Message({ content: 'Estamos salvando ainda...', type: 'success' });

        handleSalvar(true);

        if(usarLink)
        await saveComLink()

        else
        await saveComArquivo()

        handleSalvar(false);
    }

    return(
        <div className={`modal-bg`}>
            <div className='box-content-modal'>
                <form ref={formunarioRef}>
                    <div className='header-modal'>
                        <div className='closeTitle'>
                            <button onClick={event => onClose(event)} className='btnClose'>
                                <img src={iconClose} alt=''/>
                            </button>
                            <h2 className='title'>Anexo</h2>
                        </div>
                        <button className='salvar' onClick={event => onSubmit(event)}>{ salvando ? 'Salvando' : 'Salvar' }</button>
                    </div>
                    <div className='content'>
                            <div className='box-field field-checkbox'>
                                <input type='checkbox' name='usarLink' id='usarLink' value={false} onChange={() => handleUsarLink(!usarLink)}/>
                                <label htmlFor="usarLink">Usar link</label>
                            </div>
                        {
                            usarLink ? 
                            <div className='box-field'>
                                <label htmlFor="link">Link</label>
                                <Input type='text' name='link' id='link' maxLength='255' value={dataForm.link} stateValue={content => handleDataForm(content)}/>
                            </div>
                            :
                            <div className='escolha-file'>
                                <label htmlFor='file_anexo'>Escolher arquivo</label>
                                <input
                                    type='file'
                                    name='file_anexo'
                                    id='file_anexo'
                                    ref={fileInput}
                                    />
                            </div>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}