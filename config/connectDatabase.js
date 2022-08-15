const mongoose = require('mongoose');

const connectionParams={
    useCreateIndex: true,
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}

exports.connectDB = () => {
    mongoose.connect(`${process.env.DB_HOST}/${process.env.DB_NAME}`, connectionParams)
        .then( () => {
            console.log(`Connect mongodb successfully`);
        })
        .catch( (err) => {
            console.error(`Error connecting to the database. \n${err}`);
        })

    return mongoose.connection
}
