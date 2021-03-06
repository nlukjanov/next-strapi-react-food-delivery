import React from 'react';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Cookie from 'js-cookie';
import fetch from 'isomorphic-fetch';
import AppContext from '../context/AppContext';
import withData from '../lib/apollo';

const App = ({ Component, pageProps }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const token = Cookie.get('token');
  const storedCart = Cookie.get('cart');
  console.log('cart', cart);
  if (typeof cart === 'string' && cart !== 'undefined') {
    console.log('cart parse');
    JSON.parse(cart).forEach((item) => {
      setCart({
        items: storedCart,
        total: item.price * item.quantity,
      });
    });
  }
  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
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

  useEffect(() => {
    console.log('cart runnin on update', cart)
    Cookie.set('cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (item) => {
    console.log('addItem', addItem);
    const { items } = cart;
    console.log(items);
    console.log(item);
    const newItem = items.find((i) => i.id === item.id);
    console.log(newItem);
    if (!newItem) {
      console.log('new item');
      item.quantity = 1;
      console.log(cart.total, item.price);
      setCart({ items: [...items, item], total: cart.total + item.price });
    } else {
      setCart({
        items: cart.items.map((item) =>
          item.id === newItem.id
            ? Object.assign({}, item, { quantity: item.quantity + 1 })
            : item
        ),
        total: cart.total + item.price,
      });
    }
  };

  const removeItem = (item) => {
    const { items } = cart;
    const newItem = items.find((i) => i.id === item.id);
    if (newItem.quantity > 1) {
      setCart({
        items: cart.items.map((item) =>
          item.id === newItem.id
            ? Object.assign({}, item, { quantity: item.quantity - 1 })
            : item
        ),
        total: cart.total - item.price,
      });
    } else {
      const items = [...cart.items];
      const index = items.findIndex((i) => i.id === newItem.id);

      items.splice(index, 1);
      setCart({ items: items, total: cart.total - item.price });
    }
  };
  return (
    <>
      <AppContext.Provider
        value={{
          user: user,
          isAuthenticated: !!user,
          setUser: setUser,
          cart: cart,
          addItem: addItem,
          removeItem: removeItem,
        }}
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
