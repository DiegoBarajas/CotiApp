import React, { useEffect, useState } from 'react';
import backend from '../constants';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

const GraficaDia = () => {

    const [coti, setCoti] = useState([]);
    const [tick, setTick] = useState([]);
    
    useEffect(()=>{
      const getData = async()=>{
        const {data} = await axios.get(backend()+'/api/cotizacion');

        console.log(data);
      }

      if(coti.length === 0) getData();
    })

    ChartJS.register(ArcElement, Tooltip, Legend);


    const data = {
        labels: ['Cotizaciones', 'Tickets'],
        datasets: [
          {
            label: 'Hoy',
            data: [coti.length, tick.length],
            backgroundColor: [
                '#30D7DF',
                '#3C529F'
            ],
            borderColor: [
              '#30D7DF',
              '#3C529F'
            ],
            borderWidth: 1,
          },
        ],
      };

    return <Pie data={data} style={{width: '40%'}} />
    
}

export default GraficaDia