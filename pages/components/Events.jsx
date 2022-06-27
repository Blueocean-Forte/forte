import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Box, Avatar, Drawer, TextField, Grid, Typography, ImageList, ImageListItem } from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import EventIcon from '@mui/icons-material/Event';
import CircularProgress from '@mui/material/CircularProgress';
import BottomNav from './BottomNav';
import Event from './Event';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { data: getSession } = useSession();
  const sessionObj = getSession?.user;
  const [drawer, setDrawer] = useState(false);
  const [nameLength, setNameLength] = useState(0);
  const [locLength, setLocLength] = useState(0);
  const [detailLength, setDetailLength] = useState(0);
  const [images, setImages] = useState([]);
  const fileRef = useRef();
  const nameRef = useRef();
  const locRef = useRef();
  const detailRef = useRef();

  const initializeEvents = async () => {
    const response = await fetch('/api/events/getEvents', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const result = await response.json();
    setEvents(result);
    setLoaded(true);
  };

  const onEventChange = (e, target) => {
    e.preventDefault();
    if (target === 'name') {
      setNameLength(nameRef.current.value.length);
    }
    if (target === 'location') {
      setLocLength(locRef.current.value.length);
    }
    if (target === 'details') {
      setDetailLength(detailRef.current.value.length);
    }
  };

  const addImageToEvent = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (event) => {
      setImages([event.target.result]);
    };
  };

  const eventRequest = async () => {
    await fetch('/api/posts/createEvent', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        userID: sessionObj.id,
        name: sessionObj.name,
        email: sessionObj.email,
        profPic: sessionObj.image,
        details: detailRef.current.value,
        message: postRef.current.value,
        photo: images,
      }),
    });
  };

  const sendEvent = (e) => {
    e.preventDefault();
    if (!postRef.current.value) {
      return;
    }
    eventRequest();
    nameRef.current.value = null;
    locRef.current.value = null;
    detailRef.current.value = null;
    setImages([]);
    setNameLength(0);
    setLocLength(0);
    setDetailLength(0);
    setTimeout(initializeEvents, 1000);
  };

  useEffect(() => {
    initializeEvents();
  }, []);

  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', mx: 5, mb: 3, mt: 2, alignItems: 'center', justifyContent: 'center' }}>
          <Avatar src={sessionObj?.image} alt="N/A" />
          <Box
            sx={{ ml: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 5 }}
            onClick={() => { setDrawer(true); }}
          >
            Doing anything cool?
          </Box>
        </Box>
        <Box sx={{ display: loaded ? 'none' : '', color: '#673ab7' }}>
          <CircularProgress color="inherit" />
        </Box>
        <Drawer
          anchor="top"
          open={drawer}
          onClose={() => { setDrawer(false); }}
        >
          <div>
            <h1 align="center">
              Start something great.
            </h1>
            <ImageList sx={{ display: 'flex', justifyContent: 'center' }}>
              {images.length > 0 && (
                images.map((image, number) => (
                  <ImageListItem key={number}>
                    <Image src={image} alt="N/A" width={50} height={50} objectFit="contain" onClick={() => { setImages([]); }} />
                  </ImageListItem>
                ))
              )}
            </ImageList>
            <Box sx={[{ mx: 3, mb: 2 }, nameLength === 100 && { color: 'red' }]}>
              <Box sx={{ pb: 1 }}>
                <div align="right">
                  {nameLength}
                  /100
                </div>
              </Box>
              <TextField required fullWidth multiline label="Event Name" variant="outlined" inputRef={nameRef} onChange={(e) => { onEventChange(e, 'name'); }} inputProps={{ maxLength: 100 }} />
            </Box>
            <Box sx={[{ mx: 3, mb: 2 }, locLength === 50 && { color: 'red' }]}>
              <Box sx={{ pb: 1 }}>
                <div align="right">
                  {locLength}
                  /50
                </div>
              </Box>
              <TextField required fullWidth multiline label="Location" variant="outlined" inputRef={locRef} onChange={(e) => { onEventChange(e, 'location'); }} inputProps={{ maxLength: 50 }} />
            </Box>
            <Box sx={[{ mx: 3, mb: 2 }, detailLength === 300 && { color: 'red' }]}>
              <Box sx={{ pb: 1 }}>
                <div align="right">
                  {detailLength}
                  /300
                </div>
              </Box>
              <TextField required fullWidth multiline label="Details" variant="outlined" inputRef={detailRef} onChange={(e) => { onEventChange(e, 'details'); }} inputProps={{ maxLength: 300 }} />
            </Box>
            <Grid container justifyContent="space-evenly" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', px: 2, py: 1, boxShadow: 2, borderRadius: 5 }} onClick={() => fileRef.current.click()}>
                <InsertPhotoIcon />
                <Typography sx={{ ml: 1 }}>
                  photo
                </Typography>
                <input type="file" accept="image/*" ref={fileRef} onChange={(e) => { addImageToEvent(e); }} hidden />
              </Box>
              <Box sx={{ display: 'flex', px: 2, py: 1, boxShadow: 2, borderRadius: 5 }} onClick={() => { }}>
                <EventIcon />
                <Typography sx={{ ml: 1 }}>
                  create
                </Typography>
              </Box>
            </Grid>
          </div>
        </Drawer>
        {events.map((event) => (
          <div key={event._delegate._document.key.path.segments[6]}>
            <Event event={event._delegate} />
          </div>
        ))}
      </Box>

      <BottomNav />

    </div>
  );
}
