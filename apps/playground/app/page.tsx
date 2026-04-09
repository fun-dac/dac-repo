import { IiifViewer } from '@repo/ui/iiif-viewer';

const IIIF_SERVER = 'http://localhost:34252';
const IMAGE_ID = 'Yj5jrA-DKf4uBw9QfUs_H';

const Home = () => {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>IIIF Viewer</h1>
      <IiifViewer infoJsonUrl={`${IIIF_SERVER}/iiif/3/${IMAGE_ID}/info.json`} />
    </main>
  );
};

export default Home;
