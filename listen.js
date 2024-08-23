const app = require("./index.js");
const { PORT = 10000 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
