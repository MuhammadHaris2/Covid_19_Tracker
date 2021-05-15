import numeral from 'numeral';
import React from 'react';
import './Table.css';

const Table = ({countries}) => {
    // console.log("countries",countries)
    return (
        <div className="table">
        {
            countries.map(x=>(
                <tr key={x.country}>
                    <td>{x.country}</td>
                    <td><strong>{numeral(x.cases).format("0,0")}</strong></td>
                </tr>
            ))
        }
        </div>
    )
}

export default Table
