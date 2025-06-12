import express from 'express';
import loginRouter from './src/api/login.ts';
import submitOtpRouter from './src/api/submitOtp.ts';
import addProductsRouter from './src/api/addProducts.ts';

const app = express();
app.use(express.json());

app.use('/api', loginRouter);
app.use('/api', submitOtpRouter);
app.use('/api', addProductsRouter);

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 