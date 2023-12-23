import express from 'express';
import routes from './routes/authRoutes.js';
import session from 'express-session';

const app = express();
app.use(express.json());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000},
  })
);
app.set('view engine', 'ejs');

app.use('/', routes);
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
