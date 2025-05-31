const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Replace with your actual MongoDB Atlas URI
const mongoURI = "mongodb+srv://admin:1410@cluster0.aufkqfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', UserSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Show login form
app.get('/', (req, res) => {
  res.render('login');
});

// Show register form
app.get('/register', (req, res) => {
  res.render('register');
});

// Handle login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.send(`Đăng nhập thành công! Xin chào ${username}`);
  } else {
    res.send('Sai tài khoản hoặc mật khẩu!');
  }
});

// Handle register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) {
    res.send('Tài khoản đã tồn tại!');
  } else {
    const user = new User({ username, password });
    await user.save();
    res.redirect('/');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server đang chạy tại cổng ${PORT}`));
