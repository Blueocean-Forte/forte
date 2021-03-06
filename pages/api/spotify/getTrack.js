export default async function getTrack(token, trackId) {
  const result = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
  });
  const data = await result.json();
  return data;
}
