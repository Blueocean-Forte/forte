/* eslint no-unused-vars: "off" */
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { Button, Avatar, Box, List, ListItem, ListItemText, ListItemAvatar, Typography } from '@mui/material';
import Router from 'next/router';
import { AppContext } from './_app';
import getRoomId from '../utils/getRoomId';
import BottomNav from '../components/BottomNav';

export default function Friends() {
  const { data: getSession, status } = useSession();
  const sessionObj = getSession?.user;
  const [friends, setFriends] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  const { setValue, currentUser, setCurrentUser } = useContext(AppContext);

  const initializeFriends = async () => {
    setValue(1);
    const response = await fetch(`/api/users/${sessionObj?.id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const result = await response.json();
    const user = result[0]._delegate._document.data.value.mapValue.fields;
    const tempFriends = result[0]
      ._delegate._document.data.value.mapValue.fields.friends.arrayValue.values;
    setCurrentUser(user);
    setFriends(tempFriends);
    const tempFriendsData = [];
    Promise.all(user.friends.arrayValue.values.map((friend) => (
      axios.get(`/api/users/${friend.stringValue}`)
        .then((results) => {
          const currentFriend = results.data[0]._delegate._document.data.value.mapValue.fields;
          tempFriendsData.push(currentFriend);
        })
        .catch((err) => console.log(err))
    )))
      .then(() => setFriendsData(tempFriendsData));
  };

  useEffect(() => {
    if (!currentUser) {
      if (status !== 'authenticated') {
        return;
      }
      initializeFriends();
    } else {
      setFriends(currentUser.friends.arrayValue.values);
      const tempFriendsData = [];
      Promise.all(currentUser.friends.arrayValue.values.map((friend) => (
        axios.get(`/api/users/${friend.stringValue}`)
          .then((results) => {
            const currentFriend = results.data[0]._delegate._document.data.value.mapValue.fields;
            tempFriendsData.push(currentFriend);
          })
          .catch((err) => console.log(err))
      )))
        .then(() => setFriendsData(tempFriendsData));
    }
  }, [status]);

  const routeToFriendMessage = async (friend) => {
    const friendObj = {
      id: friend.id.stringValue,
      name: friend.name.stringValue,
      image: friend.profPic.stringValue,
    };
    const roomId = await getRoomId(sessionObj, friendObj);
    if (roomId) {
      Router.push(`/messages/${roomId}`);
    }
  };

  return (
    <div>
      <Head>
        <title>forte</title>
      </Head>
      <Typography sx={{ fontSize: 36, fontWeight: 700, mt: 2 }} align="center">
        Friends
      </Typography>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-evenly',
        p: 1,
        m: 1,
        width: '100%' }}
      >
        <Button sx={{ color: '#6E4FE2', textDecoration: 'underline' }} variant="text">Friends</Button>
        <Button sx={{ color: '#6E4FE2' }} variant="text" onClick={() => { Router.push('/messages'); }}>Messages</Button>
      </Box>
      <List>
        {friendsData.map((friend) => (
          <ListItem
            sx={{ width: '100%' }}
            key={friend.id.stringValue}
            secondaryAction={
                (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                    <Button variant="contained" sx={{ zIndex: '9999', backgroundColor: '#21b6ae' }} size="small" onClick={() => routeToFriendMessage(friend)}>Message</Button>
                  </Box>
                )
              }
          >
            <ListItemAvatar onClick={() => { Router.push(`/profile/${friend.id.stringValue}`); }}>
              <Box sx={{ mr: 0.5 }}>
                <Avatar src={friend.profPic.stringValue} alt="" sx={{ width: 60, height: 60, mr: 1.75 }} />
              </Box>
            </ListItemAvatar>
            <List>
              <ListItemText primary={<Typography Variant="h3" Style={{ Color: '#21b6ae' }}>{friend.name.stringValue}</Typography>} />
            </List>
          </ListItem>
        ))}
      </List>
      <BottomNav />
    </div>
  );
}
