// ** Third Party Components
// ** Custom Components
import Avatar from '@components/avatar'
import classnames from 'classnames'
import _ from 'lodash'
import { useEffect } from 'react'
import { Box, DollarSign, TrendingUp, User } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
// ** Reactstrap Imports
import { Card, CardBody, CardHeader, CardText, CardTitle, Col, Row } from 'reactstrap'
import { getAllCustomerCm, getAllItemsCm } from '../../../../redux/common/store'
import { getAllSalesByQuery } from '../../../sales/pos/store/actions'

const StatsCard = ( { cols } ) => {
  const { itemsDataCm, customerDataCm } = useSelector( ( { commons } ) => commons );
  const { allData } = useSelector( ( { posReducer } ) => posReducer );
  const dispatch = useDispatch();

  const paramsObj = {
    page: 1,
    pageSize: 1000000000
  };

  useEffect( () => {
    dispatch( getAllItemsCm() )
    dispatch( getAllCustomerCm() )
    dispatch( getAllSalesByQuery( paramsObj ) );
  }, [] )


  const data = [
    {
      title: allData?.length,
      subtitle: 'Sales',
      color: 'light-primary',
      icon: <TrendingUp size={24} />
    },
    {
      title: customerDataCm?.length,
      subtitle: 'Customers',
      color: 'light-info',
      icon: <User size={24} />
    },
    {
      title: itemsDataCm?.length,
      subtitle: 'Products',
      color: 'light-danger',
      icon: <Box size={24} />
    },
    {
      title: _.sum( allData?.map( d => d?.total ) ),
      subtitle: 'Gross Amount',
      color: 'light-success',
      icon: <DollarSign size={24} />
    }
  ]

  const renderData = () => {
    return data.map( ( item, index ) => {
      const colMargin = Object.keys( cols )
      const margin = index === 2 ? 'sm' : colMargin[0]
      return (
        <Col
          key={index}
          {...cols}
          className={classnames( {
            [`mb-2 mb-${margin}-0`]: index !== data.length - 1
          } )}
        >
          <div className='d-flex align-items-center'>
            <Avatar color={item.color} icon={item.icon} className='me-2' />
            <div className='my-auto'>
              <h4 className='fw-bolder mb-0'>{item.title}</h4>
              <CardText className='font-small-3 mb-0'>{item.subtitle}</CardText>
            </div>
          </div>
        </Col>
      )
    } )
  }

  return (
    <Card className='card-statistics'>
      <CardHeader>
        <CardTitle tag='h4'>Statistics</CardTitle>
        <CardText className='card-text font-small-2 me-25 mb-0'>Updated 1 month ago</CardText>
      </CardHeader>
      <CardBody className='statistics-body'>
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

export default StatsCard
