import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Cookie from 'js-cookie';
import fetch from 'isomorphic-fetch';
import AppContext from '../context/AppContext';
import withData from '../lib/apollo';

const App = ({ Component, pageProps }) => {
  const [user, setUser] = useState(null);
  const token = Cookie.get('token');
  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (res) => {
          if (!res.ok) {
            Cookie.remove('token');
            setUser(null);
            return null;
          }
          const user = await res.json();
          setUser(user);
        });
    }
  }, [token]);
  return (
    <>
      <AppContext.Provider
        value={{ user: user, isAuthenticated: !!user, setUser: setUser }}
      >
        <Head>
          <link
            rel='stylesheet'
            href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'
            integrity='sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm'
            crossOrigin='anonymous'
          />
        </Head>

        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContext.Provider>
    </>
  );
};

export default withData(App);
