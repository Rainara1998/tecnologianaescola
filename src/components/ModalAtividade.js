import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import iconClose from '../assets/icon-close.svg';
import Input from './Input';
import Textarea from './Textarea';
import Api from '../services/Api';
import { dateCurrent, compareDate } from './Date';

export default function ModalTurma({dataInitial, closeModal = () =>{},  Message = () => {}}){
    const [dataForm, setDataForm] = useState(dataInitial || {});
    const { materia_id } = useParams();
    const [salvando, handleSalvando] = useState(false);

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
        };

        if(dataForm.data_entrega !== ''){
            const { data_entrega, data_agendada } = dataForm;
            if(compareDate(data_entrega, data_agendada)) {
                return Message({ content: 'Data agendada maior que a data de entrega! A data agendada é quando esta atividade irá ser mostrada para o aluno. A data de entrega é até quando o aluno pode responder a atividade! Por isso a data de entrega sempre tem que ser igual ou maior a data agendada.' });
            }
        }

        handleSalvando(true)

        try {
            const join_data = Object.assign(dataForm, { materia: materia_id })
        
            const response = dataForm.id === undefined ? await Api.post('/atividade/create/', join_data) : await Api.put(`/atividade/update/${dataForm.id}`, join_data);
            const { idRegistro } = response.data;

            const content = Object.assign(join_data, {
                id: idRegistro || dataForm.id,
                isNewItem: idRegistro === undefined ? false : true
            })

            closeModal(content);

        } catch (error) {
            if(error.response !== undefined)
            Message({ content: error.response.data.message })

            else
            Message({ content: error.message })
        }

        handleSalvando(false);
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
                            <h2 className='title'>Atividade</h2>
                        </div>
                        <button className='salvar' onClick={event => onSubmit(event)}>{ salvando ? 'Salvando' : 'Salvar' }</button>
                    </div>
                    <div className='content'>
                        <div className='box-field'>
                            <label htmlFor="titulo">Título <span>*</span></label>
                            <Input type='text' name='titulo' id='titulo' maxLength='255' required value={dataForm.titulo} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="data_entrega">Data de entrega</label>
                            <Input type='date' name='data_entrega' id='data_entrega' value={dataForm.data_entrega} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="data_agendada">Programar para aparecer</label>
                            <Input type='date' name='data_agendada' id='data_agendada' value={dataForm.data_agendada || dateCurrent() } stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="carga_horaria">Carga horária</label>
                            <Input type='number' name='carga_horaria' id='carga_horaria' required value={dataForm.carga_horaria} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="descricao">Instrução</label>
                            <Textarea name='descricao' id='descricao' maxLength={300} value={dataForm.descricao} stateValue={content => handleDataForm(content)}/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}