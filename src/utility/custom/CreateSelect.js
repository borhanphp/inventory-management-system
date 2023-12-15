import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { Label } from 'reactstrap';
import '../../assets/scss/basic/erp-input.scss';
import { selectThemeColors } from '../Utils';


export default function CreateSelect( props ) {
    const { label, classNames, className, onChange, component, menuPlacement = 'auto', sideBySide = true, secondaryOption, ...rest } = props;
    return (

        <>
            {
                sideBySide ? <div className={`${classNames} erp-input-container`} >
                    <Label size='sm' className='fw-bolder text-black' style={{ color: 'black', fontWeight: "bold" }}>{label}</Label>
                    <div className='d-flex align-items-center'>
                        <span className='me-1 font-weight-bolder'>:</span>
                        {
                            component ? <CreatableSelect
                                {...rest}
                                menuPlacement={menuPlacement}
                                className='w-100'
                                classNamePrefix='dropdown'
                                components={{ MenuList: component }}
                                theme={selectThemeColors}

                            /> : <CreatableSelect
                                {...rest}
                                maxMenuHeight={200}
                                menuPlacement={menuPlacement}
                                className='w-100'
                                classNamePrefix='dropdown'
                                theme={selectThemeColors}
                                onChange={( data, e ) => {
                                    onChange( data, e );
                                }}
                            />
                        }

                        {secondaryOption && secondaryOption}
                    </div>
                </div > : <div className={`${classNames}`} >
                    {label && <Label size='sm' className='fw-bolder text-black'>{label}</Label>}
                    <div className='d-flex align-items-center'>
                        {
                            component ? <CreatableSelect
                                {...rest}
                                menuPlacement={menuPlacement}
                                className={`w-100 ${className}`}
                                classNamePrefix='dropdown'
                                components={{ MenuList: component }}
                                theme={selectThemeColors}

                            /> : <CreatableSelect
                                {...rest}
                                maxMenuHeight={200}
                                menuPlacement={menuPlacement}
                                className={`w-100 ${className}`}
                                classNamePrefix='dropdown'
                                theme={selectThemeColors}
                                onChange={( data, e ) => {
                                    onChange( data, e );
                                }}
                            />
                        }

                        {secondaryOption && secondaryOption}
                    </div>
                </div >
            }
        </>


    );
}
