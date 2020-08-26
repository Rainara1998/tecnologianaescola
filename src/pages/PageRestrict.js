import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/main.css";

export default function PageRestrict(){
    return(
        <div className='box-not-found'>
            <div className='content-not-found'>
                <h1>Você não tem acesso a essa página!</h1>
                <h1>Acesso negado!</h1>
                <Link to='/'>Ir para home</Link>
            </div>
        </div>
    )
}