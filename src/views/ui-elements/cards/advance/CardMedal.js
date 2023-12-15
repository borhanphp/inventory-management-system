// ** Reactstrap Imports
// ** Images
import medal from '@src/assets/images/illustration/badge.svg';
import { Button, Card, CardBody, CardText } from 'reactstrap';


const CardMedal = () => {

  const userData = JSON.parse( localStorage.getItem( 'userData' ) );
  return (
    <Card className='card-congratulations-medal'>
      <CardBody>
        <h5>Hello, {userData?.name}! 🎉</h5>
        <CardText className='font-small-3'>Welcome back to your Dashboard</CardText>
        <h3 className='mb-75 mt-2 pt-50'>
          <a href='/' onClick={e => e.preventDefault()}>
            $48.9k
          </a>
        </h3>
        <Button color='primary'>View Sales</Button>
        <img className='congratulation-medal' src={medal} alt='Medal Pic' />
      </CardBody>
    </Card>
  )
}

export default CardMedal
