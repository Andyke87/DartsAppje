import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { addPlayer } from '../API/api';
import "../Pages/styles/Sign.css";

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Verplicht'),
  firstname: Yup.string().required('Verplicht'),
  nickname: Yup.string().required('Verplicht'),
  email: Yup.string().email('Ongeldig e-mailadres').required('Verplicht'),
  password: Yup.string()
    .trim()
    .required('Verplicht')
    .min(5, 'Wachtwoord moet minstens 5 karakters bevatten')
    .matches(/[A-Z]/, 'Wachtwoord moet minstens één hoofdletter bevatten')
    .test(
      'is-strong-password',
      'Wachtwoord moet minstens 5 karakters bevatten en één hoofdletter hebben',
      (value) => {
        return value.length >= 5 && /[A-Z]/.test(value);
      }
    ),
});

const SignUp = () => {

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      firstname: '',
      nickname: '',
      email: '',
      password: '',
    },
    validationSchema: validationSchema
  });

 const addPlayerData = async () => {
    try {
      const startTime = new Date();
      const response = await addPlayer(formik.values);
      const endTime = new Date(); // Tijdregistratie beëindigen
      const elapsedTime = endTime - startTime; // Bereken de verstreken tijd in milliseconden

      // Sla de API-oproepstijd op in de lokale opslag
      localStorage.setItem('registrerenStart', `starttijd: ${startTime}`);
      localStorage.setItem('registrerenEind', `eindtijd: ${endTime}`);
      localStorage.setItem('registrerenVerstrekenTijd', `verstreken tijd: ${elapsedTime} ms`);

      // console.log('response:', response);

      if (response.status === 200) {
        alert('Registratie gelukt!');
        navigate('/login');
      } else {
        alert('Registratie mislukt: ' + response.data.message);
      }
    } catch (error) {
      console.error('Er is iets misgegaan:', error);
    }
  }

  return (
    <div className='flex justify-center items-center'>
      <div className='text font-bold'>
        <img src='../../public/logo.png' className='logoSign' />
        <form onSubmit={formik.handleSubmit}>
          <div className='text-left text-lg mb-5 mx-auto w-80'>
            <p className='font-bold mb-2'>Firstname</p>
            <input
              className={`border-2 border-black mb-2 text-lg rounded-md p-2 w-full ${
                formik.touched.firstname && formik.errors.firstname ? 'border-red-500' : ''
              }`}
              type="text"
              placeholder="Firstname"
              autoComplete='firstname'
              name="firstname"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstname}
            />
            {formik.touched.firstname && formik.errors.firstname ? (
              <div className="text-red-500 text-sm">{formik.errors.firstname}</div>
            ) : null}
            <p className='font-bold mb-2'>Name</p>
            <input
              className={`border-2 border-black mb-2 text-lg rounded-md p-2 w-full ${
                formik.touched.name && formik.errors.name ? 'border-red-500' : ''
              }`}
              type="text"
              placeholder="Name"
              autoComplete='name'
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            ) : null}

            <p className='font-bold mb-2'>Nickname</p>
            <input
              className={`border-2 border-black mb-2 text-lg rounded-md p-2 w-full ${
                formik.touched.nickname && formik.errors.nickname ? 'border-red-500' : ''
              }`}
              type="text"
              placeholder="Nickname"
              autoComplete='nickname'
              name="nickname"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.nickname}
            />
            {formik.touched.nickname && formik.errors.nickname ? (
              <div className="text-red-500 text-sm">{formik.errors.nickname}</div>
            ) : null}
            <p className='font-bold mb-2'>E-mail</p>
            <input
              className={`border-2 border-black mb-2 text-lg rounded-md p-2 w-full ${
                formik.touched.email && formik.errors.email ? 'border-red-500' : ''
              }`}
              type="text"
              placeholder="E-mail"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email.trim()}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}
            <p className='font-bold mb-2'>Password</p>
            <div className="flex items-center">
              <input
                className={`border-2 border-black mb-2 text-lg rounded-md p-2 w-5/6 ${
                  showPassword ? 'outline-none' : ''
                } ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
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
              <div className="text-red-500 text-sm">
                {formik.errors.password.includes('Wachtwoord moet minstens 5 karakters bevatten') && (
                  'Wachtwoord moet minstens 5 karakters bevatten'
                )}
                {formik.errors.password.includes('Wachtwoord moet minstens 5 karakters bevatten') && (
                  <br />
                )}
                {formik.errors.password.includes('Wachtwoord moet minstens één hoofdletter bevatten') && (
                  'Wachtwoord moet minstens één hoofdletter bevatten'
                )}
              </div>
            ) : null}
            <div className='flex justify-center items-center'>
              <NavLink to="/login" className='link-to-register'>
                Already signed up?
              </NavLink>
              <button type="submit" onClick={addPlayerData} className="custom-button-register">
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
