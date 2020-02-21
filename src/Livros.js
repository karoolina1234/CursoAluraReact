

import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';
import InputCustomizado from './componentes/InputCustomizado';



class FormularioLivro extends Component{
    constructor() {
        super();    
        this.state = {titulo:'',preco:'',autorId: ''};
        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo= this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
       
      }

      
      enviaForm(evento){
        evento.preventDefault();    
        $.ajax({
          url:'http://localhost:8080/api/livros',
          contentType:'application/json',
          dataType:'json',
          type:'post',
          data: JSON.stringify({titulo:this.state.titulo,preco:this.state.preco,autorId:this.state.autorId}),
          success: function(novaListagem){
            PubSub.publish('atualiza-lista-livros',novaListagem); //Método usado para informar a todos os metodos que há uma nova listagem disponível(apresentando um tópico como primeiro parametro).
            this.setState({titulo: '', preco: '', autorId: ''}) // em caso de sucesso limpar os campos.
          }.bind(this),
          error: function(resposta){
            if(resposta.status === 400){            //Status = 400 é um erro de validação
                new TratadorErros().publicaErros(resposta.responseJSON);
            }
          }, 
          beforeSend: function(){
              PubSub.publish('limpa-erros',{}); //publica um estado para ser executado antes de enviar a requisição 
          }  
        });
      }

      setTitulo(evento){
        this.setState({titulo:evento.target.value});
      }
    
      setPreco(evento){
        this.setState({preco:evento.target.value});
      }  


      setAutorId(evento){
          this.setState({autorId:evento.target.value});
      }
      render(){
        return(
     
       
         <div className="pure-form pure-form-aligned">
         <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
           <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="titulo"/>                                              
           <InputCustomizado id="preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco} label="preco"/>  
            <div className="pure-control-group">
            <label htmlFor="autorId">Autor</label>                                             
                    <select name="autorId" id="autorId" onChange={this.setAutorId}>
                        <option value="">Selecione o autor</option>
                        {
                            this.props.autores.map(function(autor){
                                return<option value={autor.id}>{autor.nome}</option>
                            })
                        }
                        </select>    
            </div>                                                       
           <div className="pure-control-group">                                  
             <label></label> 
             <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
           </div>
         </form>             
     
       </div>  
        );
     }

    }

    

    class TabelaLivros extends Component{
   
        render(){
          var livros = this.props.lista.map(function(livro){
            return(
                <tr key={livro.titulo}>
                  <td>{livro.titulo}</td>
                  <td>{livro.autor.nome}</td>
                  <td>{livro.preco}</td>
                </tr>
              );
            });
          return(
            <table className="pure-table">
              <thead>
                <tr>
                  <th>Titulo</th>
                  <th>Autor</th>
                  <th>Preco</th>
                </tr>
              </thead>
              <tbody>
                {livros}
              </tbody>
            </table>
          );
        }
      }
        
        

    export default class LivroBox extends Component{
        constructor() {
            super();    
            this.state = {lista : [],autores:[]} ;
           
          
          }
              componentDidMount() {
                $.ajax({
                  url: "http://localhost:8080/api/livros",
                  dataType: 'json',
                  success: function(resposta) {
                    this.setState({lista: resposta});
                  }.bind(this)
                });

                $.ajax({
                  url: "http://localhost:8080/api/autores",
                  dataType: 'json',
                  success: function(resposta) {
                    this.setState({autores: resposta});
                  }.bind(this)
                });

                PubSub.subscribe('atualiza-lista-livros', function(topicName,lista){
                  this.setState({lista:lista});
                }.bind(this));    
              }

    
        render(){
            return(<div>

                <div className="header">
                <h1>Cadastro de Livros</h1>
                </div>
                <div className="content" id="content">
                   <FormularioLivro autores={this.state.autores}/>
                    <TabelaLivros lista={this.state.lista}/>
                </div>
                    
              </div>);
        }
    }