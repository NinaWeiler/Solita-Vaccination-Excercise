import React from "react";
import Tooltip from '@material-ui/core/Tooltip';
import '../styles/Styles.css'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const TableHeader = ({titles}) => {
    return (
        <thead>
            <tr>
                <th></th>
                {titles.map((t, index) => {
                     return (
                         <Tooltip key={index} title={t.tooltip} aria-label={t.tooltip} placement='top' arrow>
                            <th>{t.title} <InfoOutlinedIcon fontSize='small'/></th>
                        </Tooltip>
                     )
                })}
            </tr>
      </thead>
    )
}

const SubHeader = ({title}) => {
    return (
        <tr>
            <th style={{fontWeight: 'bold'}}>{title}</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
        </tr>
    )
}


const TableRow = ({title, values, total}) => {
    return (
        <tr>
          <td>{title}</td>
          {values.map((value, index) => {
              return <td key={index} style={{textAlign: "center"}}>{value}</td>
          })}
          <td style={{ fontWeight: "bold" , textAlign: "center"}}>{total}</td>
        </tr>
    )
}

export const Table = ({ state, day }) => {
  return (
      <div className='tableStyle'>
        <table class="table is-hoverable is-narrow">
        <TableHeader titles={[{title: `On ${day}`, tooltip: 'Selected day'}, {title: 'In total', tooltip:'Status by selected day'}]} />
            <tbody>
                <TableRow title='Orders arrived (bottle)' values={[state.arrivedToday.length]}
                    total={state.totalArrivedBy.length} />
                <TableRow title='Vaccinations given' values={[state.givenToday.length]}
                    total={state.totalGivenBy.length} />
                <TableRow title='Bottles expired' values={[state.bottlesExpiredToday.length]}
                    total={state.expiredBottles.length} />
                <TableRow title='Vaccinations expiring in 10 days' values={['']}
                    total={state.expiresin10Days} />
            </tbody>
        </table>
    </div>
  );
};


export const DetailsTable = ({ state, brandDetails, InjectionsArrivedToday, InjectionsArrived, day }) => {
    return (
        <div className='tableStyle'>
        <table class='table is-hoverable is-narrow is-flex-shrink-3'>
            <TableHeader titles={[{title: 'Zerpfy', tooltip:'5 injections per bottle'},
            {title: 'Antiqua', tooltip:'4 injections per bottle'}, 
            {title: 'SolarBuddhica', tooltip:'6 injections per bottle'},
            {title: 'Total', tooltip: 'In total' }]} />
                <tbody>
                    <SubHeader title={`Status on ${day}`}/>
                    <TableRow title='Orders arrived' values={[brandDetails.zerpfyArrived.todaysOrders, brandDetails.antiquaArrived.todaysOrders, brandDetails.solarBuddhicaArrived.todaysOrders]} 
                        total={state.arrivedToday.length}/>
                    <TableRow title='Vaccinations arrived' values={[brandDetails.zerpfyArrived.todaysInjections, brandDetails.antiquaArrived.todaysInjections, brandDetails.solarBuddhicaArrived.todaysInjections]}
                        total={InjectionsArrivedToday} />
                    <TableRow title='Vaccinations expired' values={[brandDetails.zerpfyExpired, brandDetails.antiquaExpired, brandDetails.solarBuddhicaExpired]}
                        total={brandDetails.totalExpiredToday} />
                    <SubHeader title='Total status per producer' />
                    <TableRow title='Orders arrived' values={[brandDetails.zerpfyArrived.totalOrders, brandDetails.antiquaArrived.totalOrders, brandDetails.solarBuddhicaArrived.totalOrders]}
                        total={state.totalArrivedBy.length} />
                    <TableRow title='Vaccinations arrived' values={[brandDetails.zerpfyArrived.totalInjections, brandDetails.antiquaArrived.totalInjections, brandDetails.solarBuddhicaArrived.totalInjections]}
                        total={InjectionsArrived} />
                </tbody>
        </table>
        </div>
    )
}