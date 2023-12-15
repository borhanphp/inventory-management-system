import React from 'react';
import Select from 'react-select';
import { Label } from 'reactstrap';
import '../../assets/scss/basic/erp-input.scss';
import { selectThemeColors } from '../Utils';

export default function ErpSelect( props ) {
    const { label, classNames, className, onChange, component, menuPlacement = 'auto', sideBySide = true, secondaryOption, ...rest } = props;
    return (

        <>
            {
                sideBySide ? <div className={`${classNames} erp-input-container`} >
                    <Label size='sm' className='fw-bolder text-black'>{label}</Label>
                    <div className='d-flex align-items-center'>
                        <span className='me-1 font-weight-bolder'>:</span>
                        {
                            component ? <Select
                                {...rest}
                                menuPlacement={menuPlacement}
                                className='w-100'
                                classNamePrefix='dropdown'
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: ( base ) => ( {
                                        ...base,
                                        zIndex: "9999"
                                    } ),
                                }}
                                components={{ MenuList: component }}
                                theme={selectThemeColors}

                            /> : <Select
                                {...rest}
                                maxMenuHeight={200}
                                menuPlacement={menuPlacement}
                                className='w-100'
                                classNamePrefix='dropdown'
                                theme={selectThemeColors}
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: ( base ) => ( {
                                        ...base,
                                        zIndex: "9999"
                                    } ),
                                }}
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
                            component ? <Select

                                menuPlacement={menuPlacement}
                                className={`w-100 ${className}`}
                                classNamePrefix='dropdown'
                                components={{ MenuList: component }}
                                theme={selectThemeColors}
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: ( base ) => ( {
                                        ...base,
                                        zIndex: "9999"
                                    } ),
                                }}
                                {...rest}

                            /> : <Select

                                maxMenuHeight={200}
                                menuPlacement={menuPlacement}
                                className={`w-100 ${className}`}
                                classNamePrefix='dropdown'
                                theme={selectThemeColors}
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: ( base ) => ( {
                                        ...base,
                                        zIndex: "9999"
                                    } ),
                                }}
                                onChange={( data, e ) => {
                                    onChange( data, e );
                                }}

                                {...rest}
                            />
                        }

                        {secondaryOption && secondaryOption}
                    </div>
                </div >
            }
        </>


    );
}
