import React, { useState, useContext } from 'react';
import "../styles/main.css";
import "../styles/login.css";
import Input from '../components/Input';
import Api from '../services/Api';
import Message from '../components/Message';
import { AuthContext } from '../context/Auth';

export default function Login(){
    const [dataForm, setDataForm] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [messageErr, setMessageErr] = useState(null);
    const [salvando, handleSalvar] = useState(false);
    const { alterarPrimeiroAcesso } = useContext(AuthContext)

    function handleDataForm(content){
        const dataHandle = Object.assign(dataForm, content);
        setDataForm(dataHandle)
    }

    async function onSubmit(){        
        if(salvando) return setMessageErr({ content: 'Aguarde, estamos salvando sua senha!' });

        const { password, password2 } = dataForm;
        setShowPassword(false);
        setShowPassword2(false);

        if(password === '' || password2 === '') return setMessageErr({ content: 'Preencha todos os campos!' })
        
        if(password !== password2) return setMessageErr({ content: 'Senhas não são iguais!' })

        handleSalvar(true);

        try {
            const { message } = await Api.post('/alterar-senha/', { password: dataForm.password });
            setMessageErr({ content: message });
            alterarPrimeiroAcesso();
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
                    <h2 className="titlePrimary">Alterar senha</h2>
                    <p style={{ marginTop: 10 }}>Como é seu primeiro acesso, precisamos alterar sua senha padrão!</p>

                    <div className="box-field field-password">
                        <label className="label-field" htmlFor='password'>Digite uma nova senha</label>
                        <button className="show-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Esconder' : 'Mostrar' }</button>
                        <Input name="password" type={showPassword ? 'text' : 'password'} id='password' className="field" required stateValue={content => handleDataForm(content)}/>
                    </div>

                    <div className="box-field field-password">
                        <label className="label-field" htmlFor='password2'>Repita a nova senha</label>
                        <button className="show-password" onClick={() => setShowPassword2(!showPassword2)}>{showPassword2 ? 'Esconder' : 'Mostrar' }</button>
                        <Input name="password2" type={showPassword2 ? 'text' : 'password'} id='password2' className="field" required stateValue={content => handleDataForm(content)}/>
                    </div>

                    <button className="btnSubmit btnSubmitLogin" onClick={() => onSubmit()}>{ salvando ? "Salvando" : 'Salvar' }</button>
                </div>
            </div>
        </div>
        <Message message={messageErr}/>
        </>
    )
}