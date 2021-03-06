import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import getToken from './api/spotify/getToken';
import TrackList from '../components/TrackList';
import ArtistList from '../components/ArtistList';
import searchStyles from '../styles/Search.module.css';

export default function Search({ tokenProp }) {
  const [searchKey, setSearchKey] = useState('');
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [type, setType] = useState('track');

  function handleChange(e) {
    setSearchKey(e.target.value);
  }

  async function searchKeyword(keyword) {
    const tracksData = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${tokenProp}`,
      },
      params: {
        q: keyword,
        type: 'track',
      },
    });
    setTracks(tracksData.data.tracks.items);

    const artistsData = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${tokenProp}`,
      },
      params: {
        q: keyword,
        type: 'artist',
      },
    });
    setArtists(artistsData.data.artists.items);
  }

  useEffect(() => {
    if (searchKey.length > 3) {
      searchKeyword(searchKey);
    } else {
      setTracks([]);
    }
  }, [searchKey]);

  return (
    <div>
      <Head>
        <title>forte</title>
      </Head>

      <AppBar
        elevation={0}
        component="header"
        className={searchStyles.header}
      >
        <Paper
          elevation={tracks.length === 0 ? 0 : 2}
          className={searchStyles.headerContent}
        >
          <div className={searchStyles.search}>
            <SearchIcon className={searchStyles.searchIcon} />
            <Input
              className={searchStyles.searchBar}
              fullWidth
              type="search"
              placeholder="Search"
              onChange={(e) => { handleChange(e); }}
            />
            <Link href="/music">
              <Button>Cancel</Button>
            </Link>
          </div>

          {tracks.length === 0
            ? null
            : (
              <Stack className={searchStyles.filter}>
                <Chip
                  className={type === 'track' ? searchStyles.chipSelected : searchStyles.chip}
                  onClick={() => setType('track')}
                  label="Tracks"
                  component="span"
                  variant={type === 'artist' ? 'outlined' : ''}
                />
                <Chip
                  className={type === 'artist' ? searchStyles.chipSelected : searchStyles.chip}
                  onClick={() => setType('artist')}
                  label="Artists"
                  component="span"
                  variant={type === 'track' ? 'outlined' : ''}
                />
              </Stack>
            )}
        </Paper>
      </AppBar>

      <main>
        {tracks.length === 0
          ? (
            <Typography
              color="textSecondary"
              variant="body1"
              align="center"
              sx={{ marginTop: '200px' }}
            >
              Search for your favorite song or artist
            </Typography>
          )
          : (
            <Container>
              {type === 'track'
                ? <TrackList tracks={tracks} />
                : <ArtistList artists={artists} />}
            </Container>
          )}
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const tokenProp = await getToken();

  return {
    props: { tokenProp },
  };
}
