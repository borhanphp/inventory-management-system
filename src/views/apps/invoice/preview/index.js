// ** React Imports
// ** Styles
import '@styles/base/pages/app-invoice.scss'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
// ** Reactstrap Imports
import { Col, Row } from 'reactstrap'
import { getSalesById } from '../../../sales/pos/store/actions'
import AddPaymentSidebar from '../shared-sidebar/SidebarAddPayment'
import SendInvoiceSidebar from '../shared-sidebar/SidebarSendInvoice'
// ** Invoice Preview Components
import PreviewCard from './PreviewCard'





const InvoicePreview = () => {
  // ** HooksVars
  const { id } = useParams()

  // ** States
  const [data, setData] = useState( null )
  const [sendSidebarOpen, setSendSidebarOpen] = useState( false )
  const [addPaymentOpen, setAddPaymentOpen] = useState( false )

  // ** Functions to toggle add & send sidebar
  const toggleSendSidebar = () => setSendSidebarOpen( !sendSidebarOpen )
  const toggleAddSidebar = () => setAddPaymentOpen( !addPaymentOpen )

  // ** Get invoice on mount based on id
  // useEffect(() => {
  //   axios.get(`/api/invoice/invoices/${id}`).then(response => {
  //     setData(response.data)
  //   })
  // }, [] )

  const { salesBasicInfo } = useSelector( ( { posReducer } ) => posReducer )
  const location = useLocation()
  const dispatch = useDispatch()
  const invoiceId = location?.state
  useEffect( () => {
    if ( invoiceId ) {
      dispatch( getSalesById( invoiceId ) )

    }
  }, [invoiceId] )

  return (
    <>
      <div className='invoice-preview-wrapper'>
        <Row className='invoice-preview'>
          <Col xl={9} md={8} sm={12}>
            <PreviewCard data={salesBasicInfo} />
          </Col>
          {/* <Col xl={3} md={4} sm={12}>
          <PreviewActions id={id} setSendSidebarOpen={setSendSidebarOpen} setAddPaymentOpen={setAddPaymentOpen} />
        </Col> */}
        </Row>
        <SendInvoiceSidebar toggleSidebar={toggleSendSidebar} open={sendSidebarOpen} />
        <AddPaymentSidebar toggleSidebar={toggleAddSidebar} open={addPaymentOpen} />
      </div>
    </>
  )

}

export default InvoicePreview
