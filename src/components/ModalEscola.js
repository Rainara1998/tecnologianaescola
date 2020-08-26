import React, { useState } from 'react';
import iconClose from '../assets/icon-close.svg';
import Input from './Input';
import Api from '../services/Api';

export default function ModalTurma({dataInitial, isNewItem = true, closeModal = () =>{},  Message = () => {}}){
    const [dataForm, setDataForm] = useState(dataInitial || {});
    const [salvando, handleSalvar] = useState(false);

    function handleDataForm(content){
        const newData = Object.assign(dataForm,content);
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
            const response = isNewItem ? await Api.post('/escola/create/', dataForm) : await Api.put(`/escola/update/${dataForm.id}`, dataForm);
            const { idRegistro } = response.data;
            const newRegister = idRegistro !== undefined ? {
                id: idRegistro,
                isNewItem: true
            } : {
                isNewItem: false
            }
            const content = Object.assign(dataForm, newRegister)
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
                <form>
                    <div className='header-modal'>
                        <div className='closeTitle'>
                            <button onClick={event => onClose(event)} className='btnClose'>
                                <img src={iconClose} alt=''/>
                            </button>
                            <h2 className='title'>Escola</h2>
                        </div>
                        <button className='salvar' onClick={event => onSubmit(event)}>{ salvando ? 'Salvando' : 'Salvar' }</button>
                    </div>
                    <div className='content'>
                        <div className='box-field'>
                            <label htmlFor="nome_escola">Nome escola <span>*</span></label>
                            <Input type='text' name='nome_escola' id='nome_escola' maxLength='255' value={dataForm.nome_escola} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="fundacao">Data de fundação <span>*</span></label>
                            <Input type='date' name='fundacao' id='fundacao' value={dataForm.fundacao} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="cep">CEP</label>
                            <Input type='text' name='cep' id='cep' maxLength='8' value={dataForm.cep} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="endereco">Endereço</label>
                            <Input type='text' name='endereco' id='endereco' value={dataForm.endereco} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="bairro">Bairro <span>*</span></label>
                            <Input type='text' name='bairro' id='bairro' value={dataForm.bairro} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="municipio">Município <span>*</span></label>
                            <Input type='text' name='municipio' id='municipio' value={dataForm.municipio} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="estado">Estado <span>*</span></label>
                            <Input type='text' name='estado' id='estado' required maxLength={2} value={dataForm.estado} stateValue={content => handleDataForm(content)}/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}