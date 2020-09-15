import React, { useState, useEffect } from 'react';
import {Redirect} from 'react-router-dom';
import * as S from './styles';
import {format} from 'date-fns';

import api from '../../services/api';
import isConnected from '../../utils/isConnected';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TypeIcons from '../../utils/typeIcons';

function Task({match}){
    const [redirect, setRedirect] = useState(false);
    const [type, setType] = useState();
    const [id, setId] = useState();
    const [done, setDone] = useState(false);
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [date, setDate] = useState();
    const [hour, setHour] = useState();
    const [macaddress, setMacaddress] = useState(isConnected);

    async function LoadTaskDetails(){
        await api.get(`/task/${match.params.id}`)
        .then(response =>{
            setType(response.data.type);
            setTitle(response.data.title);
            setDescription(response.data.description);
            setDate(format(new Date(response.data.when), 'yyyy-MM-dd'));
            setHour(format(new Date(response.data.when), 'HH:mm'));
            setDone(response.data.done);
            setId(response.data._id);
        });
    };

    async function Save(){
        if(!type)
            return alert('Tipo é obrigatório')
        if(!title)
            return alert('Título é obrigatório')
        if(!description)
            return alert('Descrição é obrigatória')
        if(!date)
            return alert('Data é obrigatóri')
        if(!hour)
            return alert('Hora é obrigatória')
        if(match.params.id){
            await api.put(`/task/${match.params.id}`, {
                macaddress: isConnected, 
                type,
                title, 
                description,
                done,
                when: `${date}T${hour}:00.000`
            }).then(()=>
            setRedirect(true)
            ).catch(err =>{
                alert(err)
            }); 
        }else{
            await api.post(`/task`, {
                macaddress: isConnected, 
                type,
                title, 
                description,
                done,
                when: `${date}T${hour}:00.000`
            }).then(()=>
                setRedirect(true)
            ).catch(err =>{
                alert(err)
            });   
        }
    };

    async function Remove(){
        const res = window.confirm('Deseja realmente remover a tarefa?');
        if(res){
            await api.delete(`/task/${match.params.id}`)
            .then( ()=>{
                alert('Tarefa Removida com sucesso');
                setRedirect(true);
            }
            ).catch(err =>{
                alert(err)
            });
        }
    }

    useEffect(() =>{
        if(!isConnected)
            setRedirect(true);
        LoadTaskDetails();
    },[]);

    return (
    <S.Container>
        { redirect && <Redirect to="/qrcode" />}
        { redirect && <Redirect to="/"/>}
        <Header />
        
        <S.Form>
            <S.TypeIcons>
                {
                    TypeIcons.map((icon, index) =>(
                        index > 0 && 
                        <button type="button" onClick={() => setType(index)}>
                            <img src={icon} alt="Tipo da Tarefa" 
                            className={type && type != index && 'inative'}/>
                        </button>
                     ))
                }
            </S.TypeIcons>

            <S.Input>
                <span>Título</span>
                <input type="text" placeholder="Título da Tarefa" 
                    onChange={e => setTitle(e.target.value)} 
                    value={title} />
            </S.Input>

            <S.TextArea>
                <span>Descrição</span>
                <textarea rows={5} placeholder="Detalhes da tarefa"
                    onChange={e => setDescription(e.target.value)}
                    value={description} />
            </S.TextArea>

            <S.Input>
                <span>Data</span>
                <input type="date"  
                    onChange={e => setDate(e.target.value)}
                    value={date}/>
            </S.Input>

            <S.Input>
                <span>Hora</span>
                <input type="time" 
                    onChange={e => setHour(e.target.value)}
                    value={hour} />
            </S.Input>

            <S.Options>
                <div>
                    <input type="checkbox" checked={done} 
                        onChange={e => setDone(!done)}/>
                    <span>Concluído</span>
                </div>
            { match.params.id && <button type="button" onClick={Remove}>EXCLUIR</button> }
            </S.Options>
            <S.Save>
                <button type="button" onClick={Save} >Salvar</button>
            </S.Save>
        </S.Form>

        <Footer />
    </S.Container>
    );
}

export default Task;