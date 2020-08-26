import React from 'react';
import ReactDOM from 'react-dom';
import RouterPages from './RouterPages';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/Auth';
import { TurmaProvider } from './context/Turma';
import { EscolaProvider } from './context/Escola';

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <TurmaProvider>
        <EscolaProvider>
          <RouterPages />
        </EscolaProvider>
      </TurmaProvider>
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
