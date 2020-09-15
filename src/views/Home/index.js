import React, { useState, useEffect } from 'react';
import * as S from './styles';
import {Link, Redirect} from 'react-router-dom';

import api from '../../services/api';
import isConnected from '../../utils/isConnected';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FilterCard from '../../components/FilterCard';
import TaskCard from '../../components/TaskCard';

function Home(){
    const [filterActived, setFilterActived] = useState('all');
    const [tasks, setTasks] = useState([]);
    const [redirect, setRedirect] = useState(false);

    async function loadTasks(){
        await api.get(`/task/filter/${filterActived}/${isConnected}`)
        .then(response => {
            setTasks(response.data);
        });
    };

    function Notification(){
        setFilterActived('late');
    };

    useEffect(() =>{
        if(!isConnected)
            setRedirect(true);
        loadTasks();
    },[filterActived]);

    return (
    <S.Container>
        {redirect && <Redirect to="/qrcode" />}
        <Header clickNotification={Notification} />

        <S.FilterArea>
            <button type="button" onClick={() => setFilterActived("all")}>
                <FilterCard title="Todos" actived={filterActived === 'all' ? true : false}/>
            </button>
            <button type="button" onClick={() => setFilterActived("today")}>
                <FilterCard title="Hoje" actived={filterActived === 'today' ? true : false}/>
            </button>
            <button type="button" onClick={() => setFilterActived("week")}>
                <FilterCard title="Semana" actived={filterActived === 'week' ? true : false}/>
            </button>
            <button type="button" onClick={() => setFilterActived("month")}>
                <FilterCard title="Mês" actived={filterActived === 'month' ? true : false}/>
            </button>
            <button type="button" onClick={() => setFilterActived("year")}>
                <FilterCard title="Ano" actived={filterActived === 'year' ? true : false}/>
            </button>
        </S.FilterArea>
        <S.Titulo>
            <h3>{filterActived=='late' ? 'Tarefas Atrasadas' : 'Tarefas'}</h3>
        </S.Titulo>
        <S.Content>
            {tasks.map(t =>(
                <Link to={`/task/${t._id}`}>
                    <TaskCard type={t.type} title={t.title} description={t.description} when={t.when} done={t.done}/>
                </Link>
            ))}
        </S.Content>

        <Footer />
    </S.Container>
    );
}

export default Home;