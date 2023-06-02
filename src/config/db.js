const mongoose = require("mongoose");

mongoose.connection.once("open", () => {
  console.log("MongoDB bağlantı başarılı");
});

const connectDB = async () => {
  await mongoose.connect(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};

module.exports = {
  connectDB,
};
