import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/main.css";

export default function NotFound(){
    return(
        <div className='box-not-found'>
            <div className='content-not-found'>
                <h1>Página não encontrada!</h1>
                <h1>Error 404</h1>
                <Link to='/'>Ir para home</Link>
            </div>
        </div>
    )
}