import React, { useState } from 'react';
import iconClose from '../assets/icon-close.svg';
import Input from './Input';
import Api from '../services/Api';

export default function ModalAvaliar({dataInitial, closeModal = () =>{},  Message = () => {}}){
    const [dataForm, setDataForm] = useState({
        nota: dataInitial.nota || '',
        comment_avaliador: dataInitial.comment_avaliador || ''
    });
    const [salvando, handleSalvar] = useState(false);

    function handleDataForm(content){
        const newData = Object.assign(dataForm,content);
        setDataForm(newData);
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
            await Api.put(`/avaliacao/resposta/${dataInitial.id}`, dataForm);
            const content = Object.assign(dataInitial, dataForm, { isNewItem: false })
            closeModal(content);

        } catch (error) {
            if(error.response !== undefined) Message({ content: error.response.data.message })
            else Message({ content: error.message })
        }
        
        handleSalvar(false);
    }

    return(
        <div className={`modal-bg`}>
            <div className='box-content-modal'>
                <form>
                    <div className='header-modal'>
                        <div className='closeTitle'>
                            <button onClick={event => onClose(event)} className='btnClose'>
                                <img src={iconClose} alt=''/>
                            </button>
                            <h2 className='title'>Avaliar</h2>
                        </div>
                        <button className='salvar' onClick={event => onSubmit(event)}>{ salvando ? 'Salvando' : 'Salvar' }</button>
                    </div>
                    <div className='content'>
                        <div className='box-field'>
                            <label htmlFor="nota">Nota <span>*</span></label>
                            <Input type='text' name='nota' id='nota' maxLength='5' required value={dataForm.nota} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="comment_avaliador">Comentário do avaliador</label>
                            <Input type='text' name='comment_avaliador' id='comment_avaliador' maxLength={200} value={dataForm.comment_avaliador} stateValue={content => handleDataForm(content)}/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}