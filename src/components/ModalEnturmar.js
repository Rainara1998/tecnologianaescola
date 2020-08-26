import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import iconClose from '../assets/icon-close.svg';
import Input from './Input';
import Select from './Select';
import Api from '../services/Api';

export default function ModalPessoa({dataInitial, closeModal = () =>{},  Message = () => {}}){
    const [dataForm, setDataForm] = useState(dataInitial || {});
    const { escola_id } = useParams();
    const [listTurmas, newListTurmas] = useState([]);
    const [salvando, handleSalvar] = useState(false);
    const [ msg, handleMessage ] = useState('Buscando...');

    useEffect(() => {
        (async () => {
            try {
                const response = await Api.get(`/turma/list/${escola_id}/`);
                const { content } = response.data;

                if(!content.length)
                handleMessage('Nenhuma turma encontrada!');

                else{
                    const handleForSelect = content.map(item => {
                        return Object.assign({
                            value: item.id,
                            valueVisible: `${item.nome_turma} - ${item.turno}`
                        }, item)
                    })
                    newListTurmas(handleForSelect);
                }

            } catch (error) {
                if(error.response)
                Message({ content: error.response.data.message })
    
                else
                Message({ content: error.message })
            }
        })()
    }, [escola_id, Message]);

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
            const join_data = {
                turma: dataForm.turma,
                pessoa: dataForm.pessoa,
                ano_letivo: dataForm.ano_letivo
            }

            const response = dataForm.id === null ? await Api.post('/turma/enturmar/create/', join_data) : await Api.put(`/turma/enturmar/update/${dataForm.id}`, join_data);
            const { idRegistro } = response.data;

            const infoTurmaCurrent = listTurmas.filter(item => item.id === parseInt(dataForm.turma,8));

            const content = Object.assign(dataForm, {
                id: idRegistro || dataForm.id,
                turma: parseInt(dataForm.turma, 8),
                nome_turma: infoTurmaCurrent[0].nome_turma,
                turno: infoTurmaCurrent[0].turno,
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
                            <h2 className='title'>Matéria</h2>
                        </div>
                        {
                            !listTurmas.length ? <></> : 
                            <button className='salvar' onClick={event => onSubmit(event)}>{ salvando ? 'Salvando' : 'Salvar' }</button>
                        }
                    </div>
                    <div className='content'>
                        <div className='box-field'>
                            <label htmlFor="turma">Turma <span>*</span></label>
                            {
                                !listTurmas.length ? <span>{ msg }</span> :
                                <Select
                                    name='turma'
                                    required
                                    id='turma'
                                    value={dataForm.turma}
                                    stateValue={content => handleDataForm(content)}
                                    options={listTurmas}
                                    />
                            }
                        </div>
                        <div className='box-field'>
                            <label htmlFor="ano_letivo">Ano Letivo <span>*</span></label>
                            <Input type='number' name='ano_letivo' id='ano_letivo' required value={dataForm.ano_letivo} stateValue={content => handleDataForm(content)}/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}