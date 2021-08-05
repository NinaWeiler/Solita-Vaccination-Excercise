import React from "react";


const TableHeader = ({titles}) => {
    return (
        <thead>
            <tr>
                <th></th>
                {titles.map((title, index) => {
                     return <th key={index}>{title}</th>
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
    <table class="table is-hoverable is-narrow">
        <TableHeader titles={[`On ${day}`, 'In total']} />
      <tbody>
          <TableRow title='Orders arrived (bottle)' values={[state.arrivedToday.length]}
            total={state.totalArrivedBy.length} />
        {/*
        <tr>
          <td>Injections in bottles</td>
          <td>{InjectionsArrivedToday}</td>
          <td style={{ fontWeight: "bold" }}>{InjectionsArrived}</td>
        </tr>
        */}
        <TableRow title='Vaccinations given' values={[state.givenToday.length]}
            total={state.totalGivenBy.length} />
        <TableRow title='Bottles expired' values={[state.bottlesExpiredToday.length]}
            total={state.expiredBottles.length} />
        <TableRow title='Vaccinations expiring in 10 days' values={['']}
            total={state.expiresin10Days} />
      </tbody>
    </table>
  );
};


export const DetailsTable = ({ state, brandDetails, InjectionsArrivedToday, InjectionsArrived, day }) => {
    return (
        <table class='table is-hoverable is-narrow'>
            <TableHeader titles={['Zerpfy','Antiqua', 'SolarBuddhica', 'Total']} />
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
    )
}