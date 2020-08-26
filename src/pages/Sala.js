import React, { useState ,useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import "../styles/main.css";
import Header from '../components/Header';
import iconAtividade from '../assets/icon-atividade.svg'
import { dateOnly } from '../components/Date';
import Message from '../components/Message';
import Api from '../services/Api';

export default function AreaEstudante(){
    const [listMaterias, setListMaterias] = useState([])
    const [listPosts] = useState([]);
    const HistoryNavigator = useHistory();
    const [message, newMessage] = useState(null);
    const { turma_id } = useParams();

    useEffect(() => {
        (async () => {
            try {
                const contentMaterias = await Api.get(`/materia/list/${turma_id}`);
                const { content, message } = contentMaterias.data;
                if(content)
                setListMaterias(content)

                if(message)
                newMessage({ content: message })

            } catch (error) {
                if(error.response !== undefined)
                newMessage({
                    content: error.response.data.message
                })

                else
                newMessage({
                    content: error.message
                })
            }
        })()

    }, [turma_id])

    return(
        <>
        <Header/>
        <div className="box-control-atividade">
            <div className="division-area">
                <div className="box-pattern materia">
                    <h2 className="title-pattern">Suas matérias</h2>
                    <div className="list-materias">
                        {
                            !listMaterias.length ? <></> :
                            listMaterias.map(({ nome_materia, id, carga_horaria, concluido })=> (
                                <div className="choise-pattern" key={id} onClick={() => HistoryNavigator.push(`/sala/${turma_id}/materia/${id}`)}>
                                    <img src={iconAtividade} alt=""/>
                                    <div className="title-main">
                                        {nome_materia}
                                    </div>
                                    <div>
                                        {`${carga_horaria}h`}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="box-pattern postagem">
                    <h2 className="title-pattern">Últimas postagens</h2>
                    <div className="list-materias">
                        {
                            !listPosts.length ? <></> : 
                            listPosts.map(({id, title, materiaPost, dataPostagem}) => (
                                <div className="choise-pattern" key={id}>
                                    <div className="title-main">
                                        { title }
                                    </div>
                                    <div>
                                        { materiaPost }
                                    </div>
                                    <div className="text-ndestak">
                                        { dateOnly(dataPostagem) }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
        <Message message={message}/>
        </>
    )
}