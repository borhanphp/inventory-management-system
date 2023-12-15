import { MinusSquare } from "react-feather";
import { Button } from "reactstrap";
import ErpInput from "../../../../utility/custom/ErpInput";


export const itemColumn = ( handleRowsDelete, handleOnChange ) => {


    const columns = [

        {
            name: 'Actions',
            width: '70px',
            cell: ( row ) => (
                <div className='column-action'>
                    <Button.Ripple
                        // disabled={rows.length === 1}
                        onClick={() => { handleRowsDelete( row ); }}
                        className="btn-icon"
                        color="flat-light"
                    >
                        <MinusSquare
                            className='cursor-pointer'
                            color='red'
                            size={18}
                        />
                    </Button.Ripple>
                </div>
            )
        },
        {
            name: 'Item',
            sortable: true,
            cell: row => row.description
        },
        {
            name: 'Remarks',
            cell: row => (
                <div className='column-action w-100'>
                    <ErpInput
                        sideBySide={false}
                        className="w-100"
                        name="comments"
                        bsSize="sm"
                        type="textarea"
                        style={{ height: "10px" }}
                        value={row?.comments ?? ''}
                        onChange={( e ) => { handleOnChange( row.id, e ); }}

                    />
                </div>
            )
        }

    ]
    return columns

}