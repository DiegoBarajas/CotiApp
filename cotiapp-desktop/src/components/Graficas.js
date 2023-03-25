import React from 'react';

import '../styles/Graficas.css';
import GraficaDia from './GraficaDia';
import GraficaMes from './GraficaMes';

const Graficas = () => {

    const date = new Date();

    function getWeek(date) {
		const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
		const diff = date.getTime() - firstDayOfYear.getTime();
		const week = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
		
		return week;
	}

    return (
        <div className='div-graficas-main'>

            <GraficaDia/>
            <GraficaMes/>
        </div>
    )
}

export default Graficas