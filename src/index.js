import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Switch, Route } from 'react-router-dom';    //Baixei outro porque a versão é diferente porque atualizou por causa do mobile
import * as serviceWorker from './serviceWorker';
import AutorBox from './Autor';

ReactDOM.render(
    (<BrowserRouter>  
        <Switch>
            <Route exact path="/" component={App}/>
            <Route path="/autor" component={AutorBox} />
            <Route path="/livro"/>
        </Switch>
    </BrowserRouter>),
    document.getElementById('root'));


serviceWorker.unregister();