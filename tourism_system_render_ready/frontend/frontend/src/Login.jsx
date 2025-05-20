import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      alert('تم تسجيل الدخول بنجاح');
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  return (
    <div>
      <h2>تسجيل الدخول</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">دخول</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;