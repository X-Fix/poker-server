import server from './server';

const port = process.env.PORT || 3000;
const app = server.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

export default app;
