import React, { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { Table } from "reactstrap";



export const SortableTable = ( props ) => {
    const [state, setState] = useState( [
        { id: 1, name: "shrek" },
        { id: 2, name: "fiona" },
    ] );

    return (
        <Table bordered>
            <ReactSortable list={state} setList={setState}>
                {state.map( ( item ) => (
                    <tr key={item.id}>
                        <td>
                            <div >{item.name}</div>
                            <div >{item.name}</div>
                            <div >{item.name}</div>
                            <div >{item.name}</div>
                        </td>
                    </tr>
                ) )}
            </ReactSortable>

        </Table>


    );
};