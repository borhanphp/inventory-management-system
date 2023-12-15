// ** React Imports
import Breadcrumbs from '@components/breadcrumbs'
// ** Custom Components
import UILoader from '@components/ui-loader'
// ** Styles
import '@styles/react/pages/page-profile.scss'
// ** Third Party Components
import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'
// ** Reactstrap Imports
import { Button, Col, Row } from 'reactstrap'
import ProfileAbout from './ProfileAbout'
import ProfileFriendsSuggestions from './ProfileFriendsSuggestions'
import ProfileHeader from './ProfileHeader'
import ProfileLatestPhotos from './ProfileLatestPhotos'
// ** Demo Components
import ProfilePoll from './ProfilePolls'
import ProfilePosts from './ProfilePosts'
import ProfileSuggestedPages from './ProfileSuggestedPages'
import ProfileTwitterFeeds from './ProfileTwitterFeeds'






const Profile = () => {
  // ** States
  const [data, setData] = useState( null )
  const [block, setBlock] = useState( false )

  const handleBlock = () => {
    setBlock( true )
    setTimeout( () => {
      setBlock( false )
    }, 2000 )
  }

  useEffect( () => {
    axios.get( '/profile/data' ).then( response => setData( response.data ) )
  }, [] )
  return (
    <Fragment>
      <Breadcrumbs title='Profile' data={[{ title: 'Pages' }, { title: 'Profile' }]} />
      {data !== null ? (
        <div id='user-profile'>
          <Row>
            <Col sm='12'>
              <ProfileHeader data={data.header} />
            </Col>
          </Row>
          <section id='profile-info'>
            <Row>
              <Col lg={{ size: 3, order: 1 }} sm={{ size: 12 }} xs={{ order: 2 }}>
                <ProfileAbout data={data.userAbout} />
                <ProfileSuggestedPages data={data.suggestedPages} />
                <ProfileTwitterFeeds data={data.twitterFeeds} />
              </Col>
              <Col lg={{ size: 6, order: 2 }} sm={{ size: 12 }} xs={{ order: 1 }}>
                <ProfilePosts data={data.post} />
              </Col>
              <Col lg={{ size: 3, order: 3 }} sm={{ size: 12 }} xs={{ order: 3 }}>
                <ProfileLatestPhotos data={data.latestPhotos} />
                <ProfileFriendsSuggestions data={data.suggestions} />
                <ProfilePoll data={data.polls} />
              </Col>
            </Row>
            <Row>
              <Col className='text-center' sm='12'>
                <Button color='primary' className='border-0 mb-1 profile-load-more' size='sm' onClick={handleBlock}>
                  <UILoader blocking={block} overlayColor='rgba(255,255,255, .5)'>
                    <span> Load More</span>
                  </UILoader>
                </Button>
              </Col>
            </Row>
          </section>
        </div>
      ) : null}
    </Fragment>
  )
}

export default Profile
