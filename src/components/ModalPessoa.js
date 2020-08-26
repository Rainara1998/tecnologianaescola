import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import iconClose from '../assets/icon-close.svg';
import Input from './Input';
import InputCheckbox from './InputCheckbox';
import Select from './Select';
import Api from '../services/Api';
import { dateNascimento } from './Date';

export default function ModalPessoa({dataInitial, isNewItem = true, closeModal = () =>{},  Message = () => {}}){
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

        if(salvando){ return Message({ content: 'Estamos salvando ainda...', type: 'success' })}
        if(!/[0-9]{11}/.test(dataForm.cpf)){ return Message({ content: 'CPF inválido! Se você estiver colocando caracteres como ". -", por favor, retire!' })}
        if(dataForm.data_nascimento){
            const splitDate = dataForm.data_nascimento.split('-');
            if(splitDate[0] > new Date().getFullYear()) return Message({ content: 'Esta pessoa não nasceu ainda!' })
            if(splitDate[0] < 1800) return Message({ content: 'Esta pessoa não está viva!' })
        }
        if(!/@/.test(dataForm.email)){ return Message({ content: 'E-mail inválido!' })}

        handleSalvar(true);

        try {
            const join_escola_id = Object.assign(dataForm, { escola: escola_id });
            const response = isNewItem ? await Api.post('/person/create/', join_escola_id) : await Api.put(`/person/update/${dataForm.person_id}`, join_escola_id);
            const { idRegistro, defaultPassword, codigo } = response.data;
        
            const content = Object.assign(dataForm, {
                id: idRegistro !== undefined ? idRegistro.id_access : dataForm.id,
                person_id: idRegistro !== undefined ? idRegistro.person_id : dataForm.person_id,
                isNewItem: idRegistro !== undefined ? true : false
            })

            if(codigo !== undefined && codigo !== null)
            Message({ content: `O código para alterar senha desta pessoa é : ${codigo}`, type: 'success' })
            
            if(defaultPassword !== undefined)
            Message({ content: `A senha temporária dessa pessoa é: ${defaultPassword}`, type: 'success' })
        
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
                            <h2 className='title'>Pessoa</h2>
                        </div>
                        <button className='salvar' onClick={event => onSubmit(event)}>{ salvando ? 'Salvando' : 'Salvar' }</button>
                    </div>
                    <div className='content'>
                        <div className='box-field'>
                            <label htmlFor="nome_completo">Nome Completo <span>*</span></label>
                            <Input type='text' name='nome_completo' id='nome_completo' required maxLength='255' value={dataForm.nome_completo} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="data_nascimento">Data de nascimento <span>*</span></label>
                            <Input type='date' name='data_nascimento' id='data_nascimento' required value={dateNascimento(dataForm.data_nascimento)} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="tipo_certidao">Tipo de certidão</label>
                            <Select
                                name='tipo_certidao'
                                required
                                id='tipo_certidao'
                                value={dataForm.tipo_certidao || 'n'}
                                stateValue={content => handleDataForm(content)}
                                options={[
                                    {
                                        value: 'n',
                                        valueVisible: 'Nascimento'
                                    },
                                    {
                                        value: 'c',
                                        valueVisible: 'Casamento'
                                    }
                                ]}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="number_certidao">Número da certidão</label>
                            <Input type='text' name='number_certidao' id='number_certidao' required maxLength={200} value={dataForm.number_certidao} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="cpf">CPF</label>
                            <Input type='text' name='cpf' id='cpf' value={dataForm.cpf} maxLength={11} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="email">E-mail <span>*</span></label>
                            <Input type='email' name='email' id='email' required maxLength={255} value={dataForm.email} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="tel">Celular</label>
                            <Input type='tel' name='tel' id='tel' maxLength={11} value={dataForm.tel} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="nome_mae">Nome da Mãe</label>
                            <Input type='text' name='nome_mae' id='nome_mae' value={dataForm.nome_mae} maxLength={255} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field'>
                            <label htmlFor="nome_pai">Nome do Pai</label>
                            <Input type='text' name='nome_pai' id='nome_pai' value={dataForm.nome_pai} maxLength={255} stateValue={content => handleDataForm(content)}/>
                        </div>
                        <div className='box-field field-checkbox'>
                            <InputCheckbox type='checkbox' name='mora_com_os_pais' id='mora_com_os_pais' required value={dataForm.mora_com_os_pais || true} stateValue={content => handleDataForm(content)}/>
                            <label htmlFor="mora_com_os_pais">Mora com os pais</label>
                        </div>
                        <section className='section-content'>
                            <h2>Acesso</h2>

                            <div className='box-field field-checkbox'>
                                <InputCheckbox type='checkbox' name='disable_access' id='disable_access' required value={dataForm.disable_access || false} stateValue={content => handleDataForm(content)}/>
                                <label htmlFor="disable_access">Desabilitar acesso</label>
                            </div>

                            <div className='box-field field-checkbox'>
                                <InputCheckbox type='checkbox' name='primeiro_acesso' id='primeiro_acesso' required value={dataForm.primeiro_acesso} stateValue={content => handleDataForm(content)}/>
                                <label htmlFor="primeiro_acesso">Primeiro acesso</label>
                            </div>
                            <div className='box-field'>
                                <label htmlFor="type_access">Tipo de acesso</label>
                                <Select
                                    name='type_access'
                                    required
                                    id='type_access'
                                    value={dataForm.type_access || 'professor'}
                                    stateValue={content => handleDataForm(content)}
                                    options={[
                                        {
                                            value: 'admin',
                                            valueVisible: 'Administrador'
                                        },
                                        {
                                            value: 'professor',
                                            valueVisible: 'Professor'
                                        },
                                        {
                                            value: 'aluno',
                                            valueVisible: 'Aluno'
                                        },
                                        {
                                            value: 'secretario',
                                            valueVisible: 'Secretário'
                                        }
                                    ]}/>
                            </div>
                        </section>
                    </div>
                </form>
            </div>
        </div>
    )
}