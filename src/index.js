import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Switch, Route } from 'react-router-dom';    //Baixei outro porque a versão é diferente porque atualizou por causa do mobile
import * as serviceWorker from './serviceWorker';
import AutorBox from './Autor';
import Home from './Home';
import LivroBox from './Livros';

ReactDOM.render(
    (<BrowserRouter>  
        <Switch>
            <App>
            <Route path="/home" component={Home}/>
            <Route path="/autor" component={AutorBox} />
            <Route path="/livro" component={LivroBox}/>
            </App>   
        </Switch>
    </BrowserRouter>),
    document.getElementById('root'));

serviceWorker.unregister();