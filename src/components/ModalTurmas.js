import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import iconClose from '../assets/icon-close.svg';
import Input from './Input';
import Api from '../services/Api';

export default function ModalPessoa({dataInitial, closeModal = () =>{},  Message = () => {}}){
    const [dataForm, setDataForm] = useState(dataInitial || {});
    const { escola_id } = useParams();
    const [salvando, handleSalvar] = useState(false);

    function handleDataForm(content){
        const newData = Object.assign(dataForm, content);
        setDataForm(newData)
    }

    function onClose(event){
        event.preventDefault();
        closeModal();
    }

    async function onSubmit(event){
        event.preventDefault();

        if(salvando){
            Message({ content: 'Estamos salvando ainda...', type: 'success' })
            return;
        }
        handleSalvar(true);

        try {
            const join_escola_id = Object.assign(dataForm, { escola: escola_id });
            const response = dataForm.id === undefined ? await Api.post('/turma/create/', join_escola_id) : await Api.put(`/turma/update/${dataForm.id}`, join_escola_id);
            const { idRegistro } = response.data;

            const content = Object.assign(dataForm, {
                id: idRegistro || dataForm.id,
                isNewItem: idRegistro === undefined ? false : true
            })
            closeModal(content);

        } catch (error) {
            if(error.response)
            Message({ content: error.response.data.message })

            else
            Message({ content: error.message })
        }

        handleSalvar(false);
    }

    return(
        <div className={`modal-bg`}>
            <div className='box-content-modal'>
                <form encType="multipart/form-data">
                    <div className='header-modal'>
                        <div className='closeTitle'>
                            <button onClick={event => onClose(event)} className='btnClose'>
                                <img src={iconClose} alt=''/>
                            </button>
                            <h2 className='title'>Turma</h2>
                        </div>
                        <button className='salvar' onClick={event => onSubmit(event)}>{ salvando ? 'Salvando' : 'Salvar' }</button>
                    </div>
                    <div className='content'>
                        <div className='box-field'>
                            <label htmlFor="nome_turma">Nome da turma <span>*</span></label>
                            <Input type='text' name='nome_turma' id='nome_turma' required maxLength='100' value={dataForm.nome_turma} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="turno">Turno <span>*</span></label>
                            <Input type='text' name='turno' id='turno' required maxLength='15' value={dataForm.turno || 'Matutino'} stateValue={content => handleDataForm(content)}/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}