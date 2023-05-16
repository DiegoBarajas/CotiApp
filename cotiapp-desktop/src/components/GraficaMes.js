import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import sweetalert2 from 'sweetalert2';
import axios from 'axios';
import backend from '../constants';

const estaFecha = new Date();
var date = new Date();
var primeroMes = new Date();
primeroMes.setDate(1);
var cantSemanas = 0;

const GraficaMes = () => {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );

      
      const semanaActual = getWeek(date);
      const primeraSemanaMes = getWeek(primeroMes);
      
      const [semanas, setSemanas] = useState([]);
      const [tickets, setTickets] = useState([]);
      const [coti, setCoti] = useState([]);
      const [todoTick, setTodoTick] = useState([]);
      const [todoCoti, setTodoCoti] = useState([]);
      const [usuario, setUsuario] = useState({});
      const [fechaMes, setFechaMes] = useState('')
      const labels = semanas;

      const options = {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: fechaMes,
            },
          },
        };
      
      useEffect(()=>{
      const getUsuario = async()=>{
        const {data} = await axios.get(backend()+'/api/usuario/'+localStorage.getItem('id'))
          .catch((err)=>{
            console.log(err)
            sweetalert2.fire({
                icon: 'error',
                iconColor: 'red',
                title: 'ERROR: '+err.message,
                text: 'Ha ocurrido un error al conectar con el servidor. Verifique su conexion a internet',
                color: 'black',
                footer: '<p>Si el problema persiste reporte el error al correo: <a href="mailto:cotiapp.dev@gmail.com">cotiapp.dev@gmail.com</a></p>',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#F5305C'
            })

            return;
          })
        setUsuario(data);
      }

      if(usuario._id === undefined)getUsuario();
    });

    useEffect(()=>{
        const getSemanas = ()=>{
            for(let i=0; i<=(semanaActual-primeraSemanaMes); i++){
                const aux = semanas;
                setSemanas(aux.push('Semana '+(i+1)))
                setSemanas(aux);
            }

            cantSemanas = semanas.length;
        }

        if(semanas.length === 0){
          getSemanas();
        } 
    });

    useEffect(()=>{
      const getTodoC = async()=>{
          const {data} = await axios.get(backend()+'/api/cotizacion');
          setTodoCoti(data);
      }

      const getTodoT = async()=>{
        const {data} = await axios.get(backend()+'/api/ticket');
        setTodoTick(data);
      }

      if((usuario._id !== undefined) && (todoCoti.length === 0)) getTodoC();
      if((usuario._id !== undefined) && (todoTick.length === 0)) getTodoT();
    })

    useEffect(()=>{
      const getCotis = async()=>{
        const data = todoCoti;

        if(todoCoti.length > 0){
          const aux = [0,0,0,0,0,0,0,0];

          data.map((d)=>{
            const fechaData = d.fecha.split('/');
            const dateD = new Date();
            dateD.setFullYear(fechaData[2]);
            dateD.setMonth(fechaData[1]-1);
            dateD.setDate(fechaData[0]);
  
            if(d.id_empresa === usuario.id_empresa){
              const semanaHoy = getWeek(date);
              const semanaData = getWeek(dateD);

              if(date.getFullYear() === dateD.getFullYear()){
                for(let i=0; i<cantSemanas; i++){
                  
                  if(semanaData+i === semanaHoy){
                    aux[cantSemanas-i-1] = aux[cantSemanas-i-1]+1;
                  }
                
                }
              }
              
            } 
          });
  
          setCoti(aux)
        }
      }

      const getTickets = async()=>{
        const data = todoTick;
        if(todoTick.length > 0){
          const aux = [0,0,0,0,0,0,0,0,0,0,0];

          data.map((d)=>{
            const fechaData = d.fecha.split('/');
            const dateD = new Date();
            dateD.setFullYear(fechaData[2]);
            dateD.setMonth(fechaData[1]-1);
            dateD.setDate(fechaData[0]);
  
            if(d.id_empresa === usuario.id_empresa){
              const semanaHoy = getWeek(date);
              const semanaData = getWeek(dateD);
  
              if(date.getFullYear() === dateD.getFullYear()){
                for(let i=0; i<cantSemanas; i++){
  
                  if(semanaData+i === semanaHoy){
                    aux[cantSemanas-i-1] = aux[cantSemanas-i-1]+1;
                  }
                
                }
              }
              
            } 
          });
  
          setTickets(aux)
        }
      }
      getFechaMes();
      if (coti.length === 0) getCotis(); 
      if (tickets.length === 0) getTickets(); 
    })

    const setValueDate = ()=>{
      const d = date.getDate().toString();
      const m = (date.getMonth()+1).toString();
      const year = date.getFullYear().toString();

      const dia = d.length === 1 ?
                  '0'+d :
                  d;

      const mes = m.length === 1 ?
                  '0'+m :
                  m;

      return(year+'-'+mes+'-'+dia);
    }

    const data = {
        labels,
        datasets: [
          {
            label: 'Cotizaciones',
            data: semanas.map((s, i) => coti[i]),
            backgroundColor: '#30D7DF',
          },
          {
            label: 'Tickets',
            data: semanas.map((s, i) => tickets[i]),
            backgroundColor: '#3C529F',
          },
        ],
      };

      const getFechaMes = ()=>{
        const ultimoDiaSemana = obtenerUltimoDiaSemana(date.getFullYear(), getWeek(date));
        const currentDate = `${ultimoDiaSemana.getDate()+1}-${ultimoDiaSemana.getMonth()+1}-${ultimoDiaSemana.getFullYear()}`;
        const firstDate = `${primeroMes.getDate()}-${primeroMes.getMonth()+1}-${primeroMes.getFullYear()}`;

        if((estaFecha.getMonth() === date.getMonth()) && (estaFecha.getFullYear() === date.getFullYear())){
          setFechaMes(`Este mes (del ${firstDate} al ${currentDate})`)
        }else{
          setFechaMes(`Del ${firstDate} al ${currentDate}`)
        }
      }

      const cambiarFecha = (e)=>{
        const fecha = e.target.value.split('-');
        const newDate = new Date();

        //getFecha();
        setSemanas([])
  
        newDate.setDate(fecha[2]);
        newDate.setMonth(fecha[1]-1);
        newDate.setFullYear(fecha[0]);
  
        primeroMes.setMonth(fecha[1]-1);
        date = newDate;

        setCoti([]);
        setTickets([]);
      }

    return (
        <div style={{flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Bar options={options} data={data} style={{width: '120%', height: '90%', marginBottom: '20px'}} />
          <input
            type='date'
            style={{width: '80%', minHeight: '30px'}}
            onChange={cambiarFecha}
            value={setValueDate()}
          />
        </div>
    )
}

export default GraficaMes

function getWeek(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - firstDayOfYear.getTime();
    const week = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
    
    return week;
}

function obtenerUltimoDiaSemana(ano, semana) {
  var primerDia = new Date(ano, 0, (semana - 1) * 7);
  var ultimoDia = new Date(primerDia.getFullYear(), primerDia.getMonth(), primerDia.getDate() + 6);
  return ultimoDia;
}