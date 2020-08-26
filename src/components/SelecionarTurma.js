import React, { useState, useEffect, useContext } from 'react';
import "../styles/login.css";
import "../styles/main.css";
import Api from '../services/Api';
import Message from '../components/Message';
import { useHistory } from 'react-router-dom';
import { TurmaContext } from '../context/Turma';
import { AuthContext } from '../context/Auth';

export default function Selecionar(){
    const [listTurma, setListTurma] = useState([]);
    const [messageErr, setMessageErr] = useState(null);
    const NavigatorHistory = useHistory();
    const { addTurma } = useContext(TurmaContext);
    const { userDetail:{ userInfo }, logout, } = useContext(AuthContext);

    useEffect(() => {
       (async () => {
           try {
               const response = userInfo.type_access === 'aluno' ? await Api.get('/turma/enturmar/i/') : await Api.get('/professor/i/turmas/');
               const { content } = response.data;
               setListTurma(content);

           } catch (error) {
               if(error.response !== undefined)
               setMessageErr({ content: error.response.data.message })

               else
               setMessageErr({ content: error.message })
           }
       })() 
    },[userInfo.type_access])

    function playTurma(data){
        const dataTurma = {
            turma_id: data.turma,
            nome_turma: data.nome_turma,
            escola: data.escola,
            turno: data.turno,
        }
        addTurma(dataTurma);
        NavigatorHistory.push(`/sala/${data.turma}`)
    }

    return(
        <>
        <div className='body'>
        <div className="box-login-main">
            <div className="box-login">
                <div className="box-content-pattern-login">
                    <h2 className="titlePrimary" style={{ marginBottom: 20, textAlign: 'center'}}>Selecione a sua turma</h2>
                    {
                        listTurma.map((item) => {
                            const { turma, turno, nome_turma } = item;
                            if(turma === null) return <h4 style={{ marginBottom: 15, textAlign: 'center' }}>Você não esta enturmado!</h4>;
                            return (
                                <button key={turma} className='btnTurmas' onClick={() => playTurma(item)}>
                                    <div className='name'>
                                        {nome_turma} -
                                        <span>
                                            { turno }
                                        </span>
                                    </div>
                                </button>
                            )}
                        )
                    }
                    <button className='btnSubmit' onClick={() => logout()}>Sair</button>
                </div>
            </div>
        </div>
        </div>
        <Message message={messageErr}/>
        </>
    )
}