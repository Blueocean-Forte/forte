import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardActions, CardContent, CardMedia, Button, Chip, Box, Typography } from '@mui/material';
import Router from 'next/router';

export default function ExploreCard({ myGenres, user }) {
  const { data: getSession } = useSession();
  const sessionObj = getSession?.user;
  const [added, setAdded] = useState(false);
  const userData = user._delegate._document.data.value.mapValue.fields;

  const sendFriendReq = async () => {
    await fetch('/api/users/sendFriendReq', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        type: added,
        targetUserID: userData.id.stringValue,
        myUserID: sessionObj.id,
      }),
    });
    setAdded(!added);
  };

  return (
    <Card sx={{ width: 390, maxWidth: 700 }}>
      <CardMedia
        component="img"
        height="300"
        image={userData.profPic.stringValue}
        alt="N/A"
        onClick={() => { Router.push(`/profile/${userData.id.stringValue}`); }}
      />
      <CardContent sx={{ py: 0, my: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 0, py: 0 }}>
          <Typography gutterBottom component="div" sx={{ fontWeight: 600, fontSize: 24, m: 0, p: 0 }}>
            {userData.name.stringValue}
          </Typography>
          <CardActions>
            <Button
              onClick={() => { sendFriendReq(); }}
              size="small"
              sx={{ color: added ? '#e5dcfd' : '#6E4FE2', fontWeight: 700 }}
            >
              {added ? 'Request Sent' : 'Add Friend'}
            </Button>
          </CardActions>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ pb: 1 }}>
          also likes
        </Typography>
        <Box sx={{ display: 'flex' }}>
          {userData.genres.arrayValue.values.map((genre, number) => {
            let count = 0;
            if (myGenres.includes(genre.stringValue) && count < 3) {
              count += 1;
              return (
                <div key={number}>
                  <Chip label={genre.stringValue} color="primary" sx={{ bgcolor: '#673ab7', mr: 1 }} />
                </div>
              );
            }
            return null;
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
