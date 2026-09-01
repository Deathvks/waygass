const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const db = require('../models');
const { SecurityLog } = db;
const User = db.users;

const JWT_SECRET = process.env.JWT_SECRET || 'waygas_super_secret_key_2026';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.dondominio.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER || 'info@waygass.es',
    pass: process.env.SMTP_PASS || 'TUPASSWORD_AQUI'
  }
});

  router.post('/register', async (req, res) => {
    try {
      const { name, lastName, email, password, rememberMe } = req.body;
      const expiresIn = rememberMe ? '30d' : '7d';
      

    // Validación básica
    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    const passwordRules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    if (!Object.values(passwordRules).every(Boolean)) {
      return res.status(400).json({ error: "La contraseña no cumple todos los requisitos de seguridad." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Formato de correo electrónico inválido." });
    }
    
    // Verificar si existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      if (existingUser.authProvider === 'google') {
        return res.status(400).json({ error: "Este correo ya está registrado mediante Google. Por favor, inicia sesión con Google." });
      }
      return res.status(400).json({ error: "El correo electrónico ya está registrado." });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generar token de verificación
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Crear usuario
    const newUser = await User.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      role: email === 'dylanjesussuarez@gmail.com' ? 'admin' : 'user',
      subscription: email === 'dylanjesussuarez@gmail.com' ? 'pro' : 'free'
    });


    // Enviar correo de verificación
    const frontendUrl = process.env.NODE_ENV === 'production' ? 'https://waygass.es' : 'http://localhost:5173';
    const verifyUrl = `${frontendUrl}/verify?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.SMTP_USER || 'info@waygass.es',
      to: email,
      subject: 'Verifica tu cuenta en WayGass',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #f97316;">¡Bienvenido a WayGass, ${name}!</h2>
          <p>Gracias por registrarte. Para poder iniciar sesión y empezar a ahorrar en combustible, por favor verifica tu cuenta haciendo clic en el siguiente botón:</p>
          <a href="${verifyUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Verificar Cuenta</a>
          <p style="font-size: 12px; color: #666;">Si no te has registrado en WayGass, puedes ignorar este correo.</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      // Opcional: Podríamos borrar el usuario o decirle que lo intente luego, pero para este caso lo dejamos registrado
    }
    
    res.json({
      status: 'verification_required',
      message: 'Usuario registrado. Por favor, revisa tu correo electrónico para verificar tu cuenta.'
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno del servidor al registrarse." });
  }
});

  // Verificar email
  router.get('/verify', async (req, res) => {
    try {
      const { token } = req.query;
      if (!token) return res.status(400).json({ error: 'Token no proporcionado.' });

      const user = await User.findOne({ where: { verificationToken: token } });
      if (!user) {
        return res.status(400).json({ error: 'Token inválido o expirado.' });
      }

      user.isVerified = true;
      user.verificationToken = null;
      await user.save();

      res.json({ message: 'Correo verificado exitosamente.' });
    } catch (error) {
      console.error('Error verificando email:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });
  // Reenviar email de verificación
  router.post('/resend-verification', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Email requerido.' });

      const user = await User.findOne({ where: { email } });
    if (user && user.authProvider === 'google') {
      return res.status(403).json({ error: "Esta cuenta se creó con Google. Por favor, usa el botón de Iniciar sesión con Google." });
    }
    if (!user) {
        // Por seguridad no decimos si existe o no
        return res.json({ message: 'Si el correo está registrado, se ha enviado un nuevo enlace.' });
      }

      if (user.isVerified) {
        return res.status(400).json({ error: 'La cuenta ya está verificada.' });
      }

      // Generar nuevo token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.verificationToken = verificationToken;
      await user.save();

      // Enviar correo de verificación
      const frontendUrl = process.env.NODE_ENV === 'production' ? 'https://waygass.es' : 'http://localhost:5173';
      const verifyUrl = `${frontendUrl}/verify?token=${verificationToken}`;

      const mailOptions = {
        from: process.env.SMTP_USER || 'info@waygass.es',
        to: email,
        subject: 'Verifica tu cuenta en WayGass (Reenvío)',
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #f97316;">¡Hola de nuevo, ${user.name}!</h2>
            <p>Has solicitado un nuevo enlace para verificar tu cuenta en WayGass.</p>
            <a href="${verifyUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Verificar Cuenta</a>
            <p style="font-size: 12px; color: #666;">Si no has solicitado este correo, puedes ignorarlo.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: 'Se ha reenviado el correo de verificación.' });
    } catch (error) {
      console.error('Error reenviando email:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });

router.post('/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: "Token de Google no proporcionado" });
    
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.given_name || payload.name;
    const lastName = payload.family_name || "";
    
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await User.create({
        name,
        lastName,
        email,
        password: hashedPassword,
        isVerified: true,
        authProvider: 'google'
      });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name, isVerified: user.isVerified },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified } });
  } catch (error) {
    SecurityLog.create({ ip: req.clientIP, method: "POST", path: "/api/auth/google", statusCode: 401, userAgent: req.headers["user-agent"], eventType: "LOGIN_FAIL", detail: "Fallo de autenticación con Google" }).catch(()=>{});
      res.status(401).json({ error: "Fallo de autenticación con Google" });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    

    if (!email || !password) {
      return res.status(400).json({ error: "Correo y contraseña son obligatorios." });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      SecurityLog.create({ ip: req.clientIP, method: "POST", path: "/api/login", statusCode: 401, userAgent: req.headers["user-agent"], eventType: "LOGIN_FAIL", detail: "Email no encontrado: " + email }).catch(()=>{});
      return res.status(401).json({ error: "El correo o la contraseña son incorrectos." });
    }

    // Validar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      SecurityLog.create({ ip: req.clientIP, method: "POST", path: "/api/login", statusCode: 401, userAgent: req.headers["user-agent"], eventType: "LOGIN_FAIL", detail: "Contraseña incorrecta: " + email }).catch(()=>{});
      return res.status(401).json({ error: "El correo o la contraseña son incorrectos." });
    }

    if (user.isVerified === false) {
      return res.status(403).json({ error: "Por favor, verifica tu correo electrónico antes de iniciar sesión." });
    }

    // Registrar login exitoso
      SecurityLog.create({ ip: req.clientIP, method: "POST", path: "/api/login", statusCode: 200, userAgent: req.headers["user-agent"], userId: user.id, eventType: "LOGIN_OK", detail: "Login exitoso: " + user.email }).catch(()=>{});

      // Auto-upgrade a ADMIN en login (para entorno de producción si la cuenta ya existía)
    if (email === 'dylanjesussuarez@gmail.com') {
      let updated = false;
      if (user.role !== 'admin') { user.role = 'admin'; updated = true; }
      if (user.subscription !== 'pro') { user.subscription = 'pro'; updated = true; }
      if (updated) {
        await user.save();
      }
    }


    // Generar JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: rememberMe ? '365d' : '1d' });
    
    res.json({
      token,
      user: { id: user.id, name: user.name, lastName: user.lastName, email: user.email, subscription: user.subscription, role: user.role }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor al iniciar sesión." });
  }
});


module.exports = router;
