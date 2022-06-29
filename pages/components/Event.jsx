import { useState, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardActions,
  Collapse, Avatar, IconButton, Typography, Checkbox, Box, Grid } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AppContext } from '../_app';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Event({ event }) {
  const { data: getSession } = useSession();
  const sessionObj = getSession?.user;
  const eventData = event._document.data.value.mapValue.fields;
  const eventID = event._key.path.segments[6];
  const { currentUser } = useContext(AppContext);
  const [expanded, setExpanded] = useState(false);
  // const [hidden, setHidden] = useState(false);
  const [attend, setAttend] = useState(currentUser.events.arrayValue.values.some(
    (item) => item.stringValue === eventID,
  ));

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onEventChange = async () => {
    const change = attend ? 'toRemove' : 'toAdd';
    setAttend(!attend);
    await fetch('/api/events/updateAttend', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        userID: sessionObj.id,
        eventID,
        change,
      }),
    });
  };

  // const onDelete = () => {
  //   if (eventData.userID.stringValue !== sessionObj.id) {
  //     return;
  //   }
  //   const deleteEvent = async () => {
  //     await fetch(`/api/events/${event._key.path.segments[6]}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         userID: sessionObj.id,
  //       }),
  //     });
  //   };
  //   deleteEvent();
  //   setHidden(true);
  // };

  return (
    <Card sx={{ mx: 3, my: 1, width: { xs: 325, sm: 500, md: 700 }, maxWidth: 700 }}>
      <CardHeader
        avatar={(
          <Avatar src={eventData.profPic.stringValue} />
        )}
        title={eventData.userName.stringValue}
        subheader={`At ${eventData.location.stringValue}`}
      />
      {eventData.photos.arrayValue.values.length > 0 && (
        <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
          <Box sx={{ width: 300, px: 2 }}>
            <Image
              height={10}
              width={10}
              layout="responsive"
              objectFit="contain"
              src={eventData.photos.arrayValue.values[0].stringValue}
              alt="N/A"
            />
          </Box>
        </Grid>
      )}
      <CardContent>
        <Typography sx={{ textDecoration: 'underline' }} variant="body2">
          {`happening on ${new Date(eventData.date.timestampValue.seconds * 1000
            + eventData.timestamp.timestampValue.nanos / 1000000).toLocaleTimeString([], {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).slice(0, 10)}`}
        </Typography>
        <Typography variant="body1">
          {eventData.eventName.stringValue}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={() => { onEventChange(); }} aria-label="add to favorites">
          <Checkbox
            icon={<CalendarTodayIcon />}
            checkedIcon={<EventAvailableIcon sx={{ color: '#673ab7' }} />}
            checked={attend}
          />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph variant="body2">
            {eventData.details.stringValue}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
