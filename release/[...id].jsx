import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { Grid, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Router from 'next/router';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import BottomNav from '../components/BottomNav';
import { AppContext } from '../pages/_app';
import getReleaseTracks from '../pages/api/spotify/getReleaseTracks';
import getToken from '../pages/api/spotify/getToken';

const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);

  return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
};

export default function releaseTracks() {
  const { currentRelease } = useContext(AppContext);
  const [allTracks, setAllTracks] = useState(currentRelease);
  const [releaseImage] = useState(currentRelease.images[0].url);

  async function getTracksProps() {
    const tokenProp = await getToken();
    const results = await getReleaseTracks(tokenProp, currentRelease.href);
    setAllTracks(results);
  }

  useEffect(() => {
    getTracksProps();
  }, []);

  return (
    <div>
      <Head>
        <title>forte</title>
      </Head>
      <main>
        <Box sx={{ paddingTop: '10px', paddingLeft: '20px', paddingRight: '20px', marginBottom: '70px' }}>
          <Box sx={{ py: 2 }}>
            <ArrowBackIosNewIcon sx={{ color: '#5D43BF' }} onClick={() => { Router.push('/music'); }} />
          </Box>
          <Box sx={{ display: 'flex', pb: 3, borderBottom: 1, borderColor: '#F2F2F2' }}>
            <img src={releaseImage} alt="N/A" style={{ width: '150px', height: '150px', borderRadius: '4px' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', ml: 1 }}>
              <Box>
                <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>
                  {currentRelease.name || 'No Name'}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#666666' }}>
                  {currentRelease.artists[0].name}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '12px', color: '#666666' }}>
                  Released on:
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#666666' }}>
                  {currentRelease.release_date}
                </Typography>
              </Box>
            </Box>
          </Box>
          {allTracks.length && allTracks.map((track, index) => (
            <Box fullwidth key={index} sx={{ borderBottom: 1, borderColor: '#F2F2F2' }}>
              <Link href={`/track/${track.id}`}>
                <Grid sx={{ display: 'flex', flexDirection: 'row', marginBottom: '6px', overflow: 'auto', justifyContent: 'space-between' }}>
                  <Grid sx={{ display: 'flex', flexDirection: 'column', m: 0.5 }}>
                    <Typography sx={{ fontSize: '1rem', font: '#121435', fontWeight: '600' }}>
                      {track.name.length > 33 ? `${track.name.slice(0, 30)}...` : track.name}
                    </Typography>
                    <Typography sx={{ fontSize: '10px', color: '#8996A6' }}>
                      {millisToMinutesAndSeconds(track.duration_ms)}
                    </Typography>
                  </Grid>
                  <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                    <PlayCircleOutlineIcon sx={{ color: '#44566C' }} />
                  </Grid>
                </Grid>
              </Link>
            </Box>
          ))}
        </Box>
      </main>

      <BottomNav />
    </div>
  );
}
