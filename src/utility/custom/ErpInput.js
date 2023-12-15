import { Input, Label } from "reactstrap";
import '../../assets/scss/basic/erp-input.scss';

const ErpInput = ( props ) => {
    const { name, id, onChange, classNames, type = "text", label, secondaryOption, sideBySide = true, ...rest } = props;

    return (
        <>
            {
                sideBySide ? (
                    <div className={`${classNames} erp-input-container `}>
                        <Label size='sm' className='fw-bolder text-black'>{label}</Label>
                        <div className='d-flex align-items-center'>
                            <span className='me-1 fw-bolder'>:</span>
                            <Input
                                name={name}
                                id={id}
                                type={type}
                                className={`${type === 'number' && 'text-right'}`}
                                label={label}
                                bsSize='sm'
                                onChange={onChange}
                                {...rest}
                            />
                            {secondaryOption && secondaryOption}
                        </div>
                    </div>
                ) : (
                    <div className={`${classNames}`}>
                        {label && <Label size='sm' className='fw-bolder text-black'>{label}</Label>}
                        <div className='d-flex align-items-center'>
                            <Input
                                name={name}
                                id={id}
                                type={type}
                                className={`${type === 'number' && 'text-right'}`}
                                label={label}
                                bsSize='sm'
                                onChange={onChange}
                                {...rest}

                            />
                            {secondaryOption && secondaryOption}
                        </div>
                    </div>
                )
            }

        </>
    );
};


export default ErpInput;