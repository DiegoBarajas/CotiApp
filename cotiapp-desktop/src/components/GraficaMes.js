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
    
    const [semanas, setSemanas] = useState([])
    const [tickets, setTickets] = useState([2, 8, 4, 9])
    const [coti, setCoti] = useState([5, 16, 12, 4])
    const labels = semanas;

    useEffect(()=>{
        const getSemanas = ()=>{
            for(let i=0; i<=(semanaActual-primeraSemanaMes); i++){
                const aux = semanas;
                setSemanas(aux.push('Semana '+(i+1)))
                setSemanas(aux);
            }
            console.log(semanas);
        }

        

        if(semanas.length === 0)
            getSemanas();
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