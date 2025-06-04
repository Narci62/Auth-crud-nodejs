const server = require('./server');

server();

app.listen(PORT, ()=> {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

