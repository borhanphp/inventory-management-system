import { Label } from "reactstrap";
import '../../assets/scss/basic/erp-input.scss';

export const ErpDetails = ( props ) => {
    const { classNames, label, secondaryOption, sideBySide = true, value } = props;


    return (
        <>
            {
                sideBySide ? (
                    <div className={`${classNames} erp-input-container `}>
                        <Label size='sm' className='fw-bolder' style={{ color: "black", fontWeight: 'bold' }}>{label}</Label>
                        <div className='d-flex align-items-center'>
                            <span className='me-1 font-weight-bolder'>:</span>
                            <div>{value}</div>
                            {secondaryOption && secondaryOption}
                        </div>
                    </div>
                ) : (
                    <div className={`${classNames}`}>
                        {label && <Label size='sm' className='font-weight-bolder' style={{ fontWeight: "bold" }}>{label}</Label>}
                        <div className='d-flex align-items-center'>
                            <div>{value}</div>
                            {secondaryOption && secondaryOption}
                        </div>
                    </div>
                )
            }

        </>
    );
};