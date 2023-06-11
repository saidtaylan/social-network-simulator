import mongoose, { ConnectOptions } from 'mongoose'

mongoose.connection.once('open', () => {
  console.log('MongoDB bağlantı başarılı');
});

export const connectDB = async () => {
  await mongoose.connect(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    <ConnectOptions>{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  );
};
