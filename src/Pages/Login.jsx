import React, { useState } from 'react';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { getPlayers } from '../API/api';
import bcrypt from 'bcryptjs'; // Importeer bcryptjs

import '../Pages/styles/Sign.css';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Ongeldig e-mailadres').required('Verplicht'),
  password: Yup.string()
    .trim()
    .required('Verplicht')
    .min(5, 'Wachtwoord moet minstens 5 karakters bevatten')
    .matches(/[A-Z]/, 'Wachtwoord moet minstens één hoofdletter bevatten'),
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const startTime = new Date();
        const response = await getPlayers();
        const endTime = new Date(); // Tijdregistratie beëindigen
        const elapsedTime = endTime - startTime; // Bereken de verstreken tijd in milliseconden

        // Sla de API-oproepstijd op in de lokale opslag
        localStorage.setItem('inloggenStart',  `starttijd: ${startTime}`);
        localStorage.setItem('inloggenEind', `eindtijd: ${endTime}`);
        localStorage.setItem('inloggenVerstrekenTijd', `verstreken tijd: ${elapsedTime} ms`);
        
        if (response.status === 200) {
          const player = response.data.players.find(
            (player) =>
              player.email === values.email &&
              bcrypt.compareSync(values.password, player.password) // Vergelijk het wachtwoord met bcryptjs
          );

          if (player) {
            // Controle geslaagd, voer de gewenste acties uit
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 1); // vervalt na 1 dag
            document.cookie = `user_id=${player.id}; expires=${expirationDate.toUTCString()}`;
            console.log('cookie:', document.cookie);

            navigate('/');
          } else {
            // Controle mislukt, geef een melding
            alert('Inloggen is mislukt: Geen speler gevonden met opgegeven e-mail en/of wachtwoord.');
          }
        } else {
          // Mislukte API-oproep
          alert('Inloggen is mislukt:', response.data.message);
        }
      } catch (error) {
        // Fout bij het maken van verbinding met de server
        alert('Er kan geen connectie gemaakt worden met de server. Probeer het later opnieuw.');
      }
    },
  });

  return (
    <div className='flex justify-center items-center'>
      <div className='font-bold'>
        <img src='../../public/logo.png' alt='Logo' className='logoSign' />
        <form onSubmit={formik.handleSubmit}>
          <div className='text-left text-lg mb-5 mx-auto w-80'>
            <p className='font-bold mb-2'>E-mail</p>
            <input
              className={`border-2 border-black mb-2 text-lg rounded-md p-2 w-full ${
                formik.touched.email && formik.errors.email ? 'border-red-500' : ''
              }`}
              type="text"
              placeholder="E-mail"
              autoComplete="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email.trim()}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}
            <p className='font-bold mb-2'>Wachtwoord</p>
            <div className="flex items-center">
              <input
                className={`border-2 border-black mb-2 text-lg rounded-md p-2 w-5/6 ${
                  showPassword ? 'outline-none' : ''
                } ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder="Wachtwoord"
                style={{ height: '3rem' }}
                autoComplete="current-password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password.trim()}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="ml-2 font-bold"
              >
                {showPassword ? 'Verbergen' : 'Weergeven'}
              </button>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className='custom-link'>
            <Link to="/register" className='link-to'>
              Registreren
            </Link>
          </div>
          <button type="submit" className="custom-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
