import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import iconClose from '../assets/icon-close.svg';
import Input from './Input';
import Select from './Select';
import Api from '../services/Api';

export default function ModalPessoa({dataInitial, closeModal = () =>{},  Message = () => {}}){
    const [dataForm, setDataForm] = useState(dataInitial || {});
    const { escola_id, turma_id } = useParams();
    const [listProfessores, newListProfessores] = useState([]);
    const [salvando, handleSalvar] = useState(false);
    const [ msg, handleMessage ] = useState('Buscando...');

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
            const join_data = Object.assign(dataForm, { turma: turma_id });
            const response = dataForm.id === undefined ? await Api.post('/materia/create/', join_data) : await Api.put(`/materia/update/${dataForm.id}`, join_data);
            const { idRegistro } = response.data;
            const isNewRegister = {
                id: idRegistro || dataForm.id,
                isNewItem: dataForm.id === undefined ? true : false
            }

            const nome_professor = listProfessores.filter(item => item.value === parseInt(dataForm.professor, 10));
            const content = Object.assign(dataForm, isNewRegister, { nome_completo: nome_professor[0].valueVisible})
            closeModal(content);

        } catch (error) {
            if(error.response) Message({ content: error.response.data.message })
            else Message({ content: error.message })
        }
        handleSalvar(false);
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await Api.get(`/person/professores/${escola_id}/`);
                const { content } = response.data;

                if(!content.length) return handleMessage('Nenhum professor encontrado!');

                else{
                    const handleForSelect = content.map(item => {
                        return {
                            value: item.person_id,
                            valueVisible: item.nome_completo
                        }
                    })
                    newListProfessores(handleForSelect);
                }

            } catch (error) {
                if(error.response)
                Message({ content: error.response.data.message })
    
                else
                Message({ content: error.message })
            }
        })()
    }, [escola_id, Message])

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
                            !listProfessores.length ? <></> :
                            <button className='salvar' onClick={event => onSubmit(event)}>{ salvando ? 'Salvando' : 'Salvar' }</button>
                        }
                    </div>
                    <div className='content'>
                        <div className='box-field'>
                            <label htmlFor="nome_materia">Nome da matéria <span>*</span></label>
                            <Input type='text' name='nome_materia' id='nome_materia' required maxLength='255' value={dataForm.nome_materia} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="professor">Professor <span>*</span></label>
                            {
                                !listProfessores.length ? <span style={{ color: '#999999', marginTop: 15, }}>{ msg }</span> : 
                                <Select
                                    name='professor'
                                    required
                                    id='professor'
                                    value={dataForm.professor}
                                    stateValue={content => handleDataForm(content)}
                                    options={listProfessores}/>
                            }
                        </div>
                        <div className='box-field'>
                            <label htmlFor="carga_horaria">Carga horária <span>*</span></label>
                            <Input type='number' name='carga_horaria' id='carga_horaria' required value={dataForm.carga_horaria} stateValue={content => handleDataForm(content)}/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}