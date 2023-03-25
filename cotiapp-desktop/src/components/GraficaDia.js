import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

const GraficaDia = () => {

    ChartJS.register(ArcElement, Tooltip, Legend);

    const data = {
        labels: ['Cotizaciones', 'Tickets'],
        datasets: [
          {
            label: 'Hoy',
            data: [12, 9],
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