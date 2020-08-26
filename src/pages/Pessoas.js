import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import '../styles/main.css';
import Api from '../services/Api';
import MessageComponent from '../components/Message';
import { useParams } from 'react-router-dom';

export default function Aluno(){
    const [listAlunos, newListAlunos] = useState([]);
    const [listProfessores, newListProfessores] = useState([]);
    const [message, newMessage] = useState(null);
    const { turma_id } = useParams();
    
    useEffect(() => {
        async function getProfessores() {
            try {
                const response = await Api.get(`/professor/${turma_id}/`);
                const { content } = response.data;

                if(!content.length) newMessage({ content: "Nenhum professor encontrado!" })
                else newListProfessores(content);

            } catch (error) {
                if(error.response) newMessage({ content: error.response.data.message });
                else newMessage({ content: error.message });
            }
        }

        async function getAlunos() {
            try {
                const response = await Api.get(`/aluno/${turma_id}/`);
                const { content } = response.data;

                if(!content.length) newMessage({ content: "Nenhum aluno encontrado!" })
                else newListAlunos(content);

            } catch (error) {
                if(error.response) newMessage({ content: error.response.data.message });
                else newMessage({ content: error.message });
            }
        }

        getProfessores();
        getAlunos();

    },[turma_id])

    return(
        <>
        <Header/>
        <div className={`box-control-atividade`}>
            <div className="box-pattern">
                <h1 className='titleLists'>{ listProfessores.length } professores</h1>
                {
                    listProfessores.map(data => (
                        <div className='list' key={data.id}>
                            <div className='column-main'>
                                <div style={{ backgroundImage: `url(${data.foto})` }} className='foto-perfil-list'/>
                                { data.nome_completo }
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="box-pattern">
                <h1 className='titleLists'>{ listAlunos.length } alunos</h1>
                {
                    listAlunos.map(data => (
                        <div className='list' key={data.id}>
                            <div className='column-main'>
                                <div style={{ backgroundImage: `url(${data.foto})` }} className='foto-perfil-list'/>
                                { data.nome_completo }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
        {
            <MessageComponent message={message} />
        }
        </>
    )
}