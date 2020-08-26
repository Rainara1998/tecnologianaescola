import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import "../styles/main.css";
import "../styles/login.css";
import Api from '../services/Api';
import Message from '../components/Message';
import { AuthContext } from '../context/Auth';
import Input from '../components/Input';

export default function CodigoNovaSenha(){
    const [dataForm, setDataForm] = useState({});
    const [messageErr, setMessageErr] = useState(null);
    const [salvando, handleSalvar] = useState(false);
    const { signIn } = useContext(AuthContext);

    function handleDataForm(content){
        setDataForm(_data => Object.assign(_data, content))
    }

    async function onSubmit(){        
        if(salvando) return setMessageErr({ content: 'Aguarde, estamos verificando sua solicitação!' });

        if(dataForm.email === '' || dataForm.codigo === '') return setMessageErr({ content: 'Todos os campos são obrigatórios!' });

        if(!/@/.test(dataForm.email)) return  setMessageErr({ content: 'E-mail inválido!' });

        if(dataForm.codigo.length !== 10) return  setMessageErr({ content: 'Código precisa ter 10 caracteres!' });

        handleSalvar(true);

        try {
            const response = await Api.post('/verificando-codigo/nova-senha/', dataForm);
            signIn(response.data)
        } catch (error) {
            if(error.response !== undefined) setMessageErr({ content: error.response.data.message });
            else setMessageErr({ content: error.message })
        }

        handleSalvar(false);
    }
    return(
        <>
        <div className='body'>
            <div className="box-login">
                <div className='box-content-pattern-login'>
                    <h2 className="titlePrimary">Verificação para alterar a senha</h2>
                    <p style={{ marginTop: 10 }}>O código é liberado pela secretária da sua escola!</p>

                    <div className="box-field">
                        <Input
                            placeholder='Digite seu e-mail'
                            name="email"
                            type='email'
                            id='email'
                            autoFocus
                            className="field"
                            maxLength={255}
                            required
                            stateValue={content => handleDataForm(content)}/>
                    </div>

                    <div className="box-field">
                        <Input
                            placeholder='Código'
                            name="codigo"
                            type='text'
                            id='codigo'
                            className="field"
                            maxLength={10}
                            required
                            stateValue={content => handleDataForm(content)}/>
                    </div>
                    <button className='btnSubmit' onClick={() => onSubmit()}>Verificar</button>
                    <Link to='/login' style={{
                        textAlign: 'center',
                        margin: '15px auto',
                        display: 'block',
                        width: 190,
                        padding: '10px 0'
                    }}>Não preciso do código</Link>
                </div>
            </div>
        </div>
        <Message message={messageErr}/>
        </>
    )
}