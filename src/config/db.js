import mongoose from 'mongoose';
import dns from 'node:dns';

dns.setServers([
    '8.8.8.8',
    '1.1.1.1'
]);

export const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'tutiket'
        });

        console.log('🟢 MongoDB Atlas conectado correctamente 🟢 !!');
    } catch (error) {
        console.log('Error al conectar con mongoDB:', error.message);

        process.exit(1);
    }

};