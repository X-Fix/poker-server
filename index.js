import nanoexpress from 'nanoexpress';

const app = nanoexpress();

app.get('/', (req, res) => {
    return res.send({ status: 'ok' });
});

app.listen(3000);
