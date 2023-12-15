import React from 'react';
import CustomModal from '../../../../utility/custom/CustomModal';
import ErpInput from '../../../../utility/custom/ErpInput';

const ApproveModal = () => {
    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog modal-lg'
                openModal={isOpen}
                handleMainModelSubmit={handleModelSubmit}
                handleMainModalToggleClose={handleModalToggleClose}
                handleModelSubmit={handleModelSubmit}
                title={`Master Document`}
                okButtonText='Submit'
            >
                <ErpInput
                    sideBySide={false}
                    label="Note for Requisitor"
                />

            </CustomModal>
        </div>
    )
}

export default ApproveModal