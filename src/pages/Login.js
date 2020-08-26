import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import "../styles/main.css";
import "../styles/login.css";
import Input from '../components/Input';
import Logo from '../assets/logo-transparent.png';
import Api from '../services/Api';
import Message from '../components/Message';
import { AuthContext } from '../context/Auth';

export default function Login(){
    const [dataForm, setDataForm] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [messageErr, setMessageErr] = useState(null);
    const [carregando, alterarCarregando] = useState(false);
    const { signIn } = useContext(AuthContext)

    function handleDataForm(content){
        const dataHandle = Object.assign(dataForm, content);
        setDataForm(dataHandle)
    }

    async function onSubmit(){
        if(carregando){
            setMessageErr({ content: 'Aguarde enquanto verificamos seu acesso!' })
            return;
        }

        const { password, email } = dataForm;
        if(password === '' || email === ''){
            setMessageErr({ content: 'Todos os campos são obrigatórios!' })
            return;
        }

        alterarCarregando(true)

        try {
            const responseLogin = await Api.post('/login', dataForm);
            const content = responseLogin.data;
            if(content.content.disable_access){
                setMessageErr({ content: 'Seu acesso está bloqueado!' });
                alterarCarregando(false)
                return;
            }

            signIn(content, 'login')

        } catch (error) {
            setMessageErr({
                content: error.response.data.message || error.message
            })
        }

        alterarCarregando(false)
    }
    return(
        <>
        <div className='body'>
        <div className="box-login-main">
            <div className="box-login">
                <div className='box-content-pattern-login'>
                    <h2 className="titlePrimary">Faça seu login</h2>
                    <div className="box-field">
                        <label className="label-field" htmlFor='email'>E-mail</label>
                        <Input name="email" type="email" className="field" id='email' required autoFocus stateValue={content => handleDataForm(content)}/>
                    </div>
                    <div className="box-field field-password">
                        <label className="label-field" htmlFor='password'>Senha</label>
                        <button className="show-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Esconder' : 'Mostrar' }</button>
                        <Input name="password" type={showPassword ? 'text' : 'password'} id='password' className="field" required stateValue={content => handleDataForm(content)}/>
                    </div>
                    <button className="btnSubmit btnSubmitLogin" onClick={() => onSubmit()}>{ carregando ? "Carregando..." : "Entrar" }</button>
                    <Link to='/codigo/senha-nova/' style={{
                        textAlign: 'center',
                        margin: '15px auto',
                        display: 'block',
                        padding: '10px 0'
                    }}>Trocar senha com código</Link>
                </div>
            </div>
            <div className="logo-frase">
                <div className="image-logo">
                    <img src={Logo} alt=""/>
                </div>
                <div className="login-frase-title">
                    <h1>Tecnologia na Escola</h1>
                    <p>
                        “A educação é a arma mais poderosa que você pode usar para mudar o mundo!”
                    </p>
                    <span>Nelson Mandela</span>
                </div>
            </div>
        </div>
        </div>
        <Message message={messageErr}/>
        </>
    )
}