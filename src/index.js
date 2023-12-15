// ** React Imports
// ** React Hot Toast Styles
import '@styles/react/libs/react-hot-toasts/react-hot-toasts.scss';
// ** PrismJS
import 'prismjs';
import 'prismjs/components/prism-jsx.min';
import 'prismjs/themes/prism-tomorrow.css';
import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
// ** Toast
import { Toaster } from 'react-hot-toast';
// ** React Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import '../src/views/eshop/featured-category/list/style.css';
// ** Core styles
import './@core/assets/fonts/feather/iconfont.css';
// ** Ripple Button
import './@core/components/ripple-button';
// ** Spinner (Splash Screen)
import Spinner from './@core/components/spinner/Fallback-spinner';
import './@core/scss/core.scss';
import './assets/scss/style.scss';
// ** Intl, CASL & ThemeColors Context
import ability from './configs/acl/ability';
// ** i18n
import './configs/i18n';
// ** ThemeConfig
import themeConfig from './configs/themeConfig';
// ** Redux Imports
import { store } from './redux/store';
// ** Service Worker
import * as serviceWorker from './serviceWorker';
import { AbilityContext } from './utility/context/Can';
import { ThemeContext } from './utility/context/ThemeColors';

// ** Lazy load app
const LazyApp = lazy( () => import( './App' ) );

const container = document.getElementById( 'root' );
const root = createRoot( container );

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <AbilityContext.Provider value={ability}>
          <ThemeContext>
            <LazyApp />
            <Toaster position={themeConfig.layout.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
          </ThemeContext>
        </AbilityContext.Provider>
      </Suspense>
    </Provider>
  </BrowserRouter>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
