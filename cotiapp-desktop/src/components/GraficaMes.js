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

const GraficaMes = () => {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const date = new Date();
    const primeroMes = new Date();
    primeroMes.setDate(1);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `Este mes (${meses[date.getMonth()]} ${date.getFullYear()})`,
          },
        },
      };

    const semanaActual = getWeek(date);
    const primeraSemanaMes = getWeek(primeroMes);
    
    const [semanas, setSemanas] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [coti, setCoti] = useState([]);
    const [usuario, setUsuario] = useState({});
    const [cantSemanas, setCantSemanas] = useState(0);
    const labels = semanas;

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

            setCantSemanas(semanas.length);
        }

        if(semanas.length === 0) 
        getSemanas();
    });

    useEffect(()=>{
      const getCotis = async()=>{
        const {data} = await axios.get(backend()+'/api/cotizacion');
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

        setCoti(aux)
      }

      const getTickets = async()=>{
        const {data} = await axios.get(backend()+'/api/ticket');
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

      if ((usuario._id !== undefined) && (coti.length === 0)){
        getCotis();
        getTickets();
      }
    })

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

    return (
        <Bar options={options} data={data} />
    )
}

export default GraficaMes

function getWeek(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - firstDayOfYear.getTime();
    const week = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
    
    return week;
}