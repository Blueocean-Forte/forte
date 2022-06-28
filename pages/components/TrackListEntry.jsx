import React from 'react';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import trackListStyles from '../../styles/TrackList.module.css';

export default function TrackListEntry({ track }) {
  return (
    <ListItem button className={trackListStyles.trackListEntry}>
      <img
        src={track.album.images[0].url}
        alt="album-cover"
      />
      <div className={trackListStyles.trackListEntryInfo}>
        <Typography noWrap>{track.name}</Typography>
        <Typography component="span">{track.artists[0].name}</Typography>
      </div>
    </ListItem>
  );
}