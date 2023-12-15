// ** React Imports
// ** Custom Components
import Avatar from '@components/avatar';
// ** Custom Hooks
import { useSkin } from '@hooks/useSkin';
import illustrationsDark from '@src/assets/images/pages/login-v2-dark.svg';
// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/login-v2.svg';
// ** Context
import { AbilityContext } from '@src/utility/context/Can';
// ** Actions
import { handleLogin } from '@store/authentication';
// ** Styles
import '@styles/react/pages/page-authentication.scss';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useContext, useState } from 'react';
import { Coffee, X } from 'react-feather';
import { useForm } from 'react-hook-form';
// ** Third Party Components
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
// ** Reactstrap Imports
import {
  Button, Card, CardBody, Form, Input,
  Label,
  Spinner
} from 'reactstrap';
import { generalStoreApi } from '../../../services/api_endpoint';
import { getHomeRouteForLoggedInUser } from '../../../utility/Utils';


const ToastContent = ( { t, name, role } ) => {
  return (
    <div className='d-flex'>
      <div className='me-1'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
      </div>
      <div className='d-flex flex-column'>
        <div className='d-flex justify-content-between'>
          <h6>{name}</h6>
          <X size={12} className='cursor-pointer' onClick={() => toast.dismiss( t.id )} />
        </div>
        <span>You have successfully logged in.</span>
      </div>
    </div>
  );
};


const LoginBasic = () => {

  const { skin } = useSkin();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ability = useContext( AbilityContext );
  const [spin, setSpin] = useState( false );
  const [formData, setFormData] = useState( {
    userNameOrEmail: '',
    password: ''
  } );
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight;

  const onSubmit = async () => {
    if ( Object.values( formData ).every( field => field.length > 0 ) ) {
      axios
        .post( `${generalStoreApi.userLogin.root}`, {
          userNameOrEmail: formData.userNameOrEmail,
          password: formData.password,
        } )
        .then( res => {
          // console.log( res.data );
          if ( !res.data.userId ) {
            setSpin( true )
          } else {
            const decoded = jwt_decode( res.data.accessToken );
            const userData = {
              ...res.data.userData,
              accessToken: res.data.accessToken,
              refreshToken: decoded.refreshToken,
              name: decoded.name,
              username: decoded.unique_name,
              role: decoded.Role,
              ability: [
                {
                  action: 'manage',
                  subject: 'all'
                }
              ],
            };

            dispatch( handleLogin( userData ) );
            // navigate( '/' )
            navigate( getHomeRouteForLoggedInUser( userData.role ) );
            navigate( 0 )
            setSpin( false )
            toast( t => <ToastContent t={t} role={userData.role || 'admin'} name={userData.name || userData.username} /> );
          }

        } )

        .catch( err => {
          setSpin( true )
          toast.error( err.response.data.detail )
          setSpin( false )
          // setError( 'password', {
          //   type: 'manual',
          //   message: err.response.data.detail,
          // } );
        } );
    } else {
      for ( const key in formData ) {
        if ( formData[key].length === 0 ) {
          setError( key, {
            type: 'manual',
          } );
        }
      }
    }
  };



  return (
    <div className='auth-wrapper auth-basic px-2'>
      <div className='auth-inner my-2'>
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
              <svg viewBox='0 0 139 95' version='1.1' height='28'>
                <defs>
                  <linearGradient x1='100%' y1='10.5120544%' x2='50%' y2='89.4879456%' id='linearGradient-1'>
                    <stop stopColor='#000000' offset='0%'></stop>
                    <stop stopColor='#FFFFFF' offset='100%'></stop>
                  </linearGradient>
                  <linearGradient x1='64.0437835%' y1='46.3276743%' x2='37.373316%' y2='100%' id='linearGradient-2'>
                    <stop stopColor='#EEEEEE' stopOpacity='0' offset='0%'></stop>
                    <stop stopColor='#FFFFFF' offset='100%'></stop>
                  </linearGradient>
                </defs>
                <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                  <g id='Artboard' transform='translate(-400.000000, -178.000000)'>
                    <g id='Group' transform='translate(400.000000, 178.000000)'>
                      <path
                        d='M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z'
                        id='Path'
                        className='text-primary'
                        style={{ fill: 'currentColor' }}
                      ></path>
                      <path
                        d='M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z'
                        id='Path'
                        fill='url(#linearGradient-1)'
                        opacity='0.2'
                      ></path>
                      <polygon
                        id='Path-2'
                        fill='#000000'
                        opacity='0.049999997'
                        points='69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325'
                      ></polygon>
                      <polygon
                        id='Path-2'
                        fill='#000000'
                        opacity='0.099999994'
                        points='69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338'
                      ></polygon>
                      <polygon
                        id='Path-3'
                        fill='url(#linearGradient-2)'
                        opacity='0.099999994'
                        points='101.428699 0 83.0667527 94.1480575 130.378721 47.0740288'
                      ></polygon>
                    </g>
                  </g>
                </g>
              </svg>
              <h2 className='brand-text text-primary ms-1'>G Store</h2>
            </Link>
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit( onSubmit )}>
              <div className='mb-1'>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Input
                  autoFocus
                  name='userNameOrEmail'
                  placeholder='john@example.com'
                  value={formData.userNameOrEmail}
                  onChange={( e ) => { setFormData( { ...formData, userNameOrEmail: e.target.value } ) }}
                  invalid={( errors?.userNameOrEmail && !formData?.userNameOrEmail?.length ) && true}
                />
                {/* {errors.userNameOrEmail && !formData?.userNameOrEmail?.length && <FormFeedback>{errors.userNameOrEmail.message}</FormFeedback>} */}
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                  {/* <Link to='/forgot-password'>
                    <small>Forgot Password?</small>
                  </Link> */}
                </div>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='123456'
                  value={formData.password}
                  onChange={( e ) => { setFormData( { ...formData, password: e.target.value } ) }}
                  invalid={( errors?.password && !formData?.password?.length ) && true}
                />
                {/* {errors?.password && !formData?.password?.length && <FormFeedback>{errors?.password?.message}</FormFeedback>} */}
              </div>
              <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Remember Me
                </Label>
              </div>
              {
                spin ? (
                  <Button color='primary' block disabled>
                    <Spinner size='sm' />
                  </Button>
                ) : (
                  <Button type='submit' color='primary' block>
                    Sign in
                  </Button>
                )
              }



            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default LoginBasic;
