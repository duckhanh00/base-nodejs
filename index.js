// Nam Hoai Vu: vunam722000@gmail.com

const server = require('./config/server')

require('./global')(server);
require('./config/connectDatabase').connectDB();

server.listen(process.env.PORT || 5000, function () {
  console.log('Example app listening on port 5000!');
});

