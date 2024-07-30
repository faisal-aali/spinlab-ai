"use client";
import { Checkbox } from '@mui/material';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Yup from 'yup';

const roleSchema = Yup.object().shape({
  role: Yup.string().required('Role is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const SelectRole = ({ nextStep, handleChange, values }) => {
  const router = useRouter()
  const [error, setError] = useState('')

  const handleGoBack = async (e) => {
    console.log('handleGoBack clicked')
    e.preventDefault()
    await signOut({ redirect: false }).catch(console.error)
    router.replace('/login')
  }

  const checkEmail = (email) => {
    return new Promise((resolve, reject) => {
      axios.get('/api/users/emailExists', {
        params: {
          email
        }
      }).then(res => {
        const exists = res.data
        if (exists) reject('Email already exists')
        else resolve()
      }).catch(err => {
        console.error(err)
        reject(`Error occured: ${err.response.data.message || err.message}`)
      })
    })
  }

  return (
    <div>
      <Formik
        initialValues={values}
        validationSchema={roleSchema}
        onSubmit={(values) => {
          console.log('selectrole submit', values);
          handleChange("role")({ target: { value: values.role } });
          handleChange("email")({ target: { value: values.email } });
          checkEmail(values.email).then(() => {
            nextStep();
          }).catch(setError)
        }}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form className={`flex items-center justify-center RegisterFormWidth bg-transparent border primary-border py-16 px-10 rounded-lg w-full `}>
            <div className="flex flex-col w-full gap-[31px]">
              <h2 className="text-white font-bold text-center text-3xl">Please select your role:</h2>
              <div className="flex justify-between">
                <button
                  type="button"
                  name='role'
                  className={`w-full py-2 mr-4 px-4 rounded-md ${values.role === 'player' ? 'bg-primary text-black' : 'backgroundDisabledColor text-white'}`}
                  onClick={() => setFieldValue("role", "player")}
                >
                  Player
                </button>
                <button
                  type="button"
                  name='role'
                  className={`w-full py-2 mr-4 px-4 rounded-md ${values.role === 'trainer' ? 'bg-primary text-black' : 'backgroundDisabledColor text-white'}`}
                  onClick={() => setFieldValue("role", "trainer")}
                >
                  Trainer
                </button>
              </div>
              {errors.role && touched.role ? <div className="text-red-500 text-sm">{errors.role}</div> : null}
              {/* <div className='flex flex-row  gap-[31px]'>
              <div className='flex flex-row items-center gap-[12px]'>
                <div>
                  <Checkbox sx={{ width: 10, height: 10, color: '#FFFFFF30' }} disableRipple />
                </div>
                <div>
                  <label style={{ color: '#FFFFFF30' }}>Free User</label>
                </div>
              </div>
              <div className='flex flex-row items-center gap-[12px]'>
                <div>
                  <Checkbox sx={{ width: 10, height: 10, color: '#FFFFFF30' }} disableRipple />
                </div>
                <div>
                  <label style={{ color: '#FFFFFF30' }}>Monthly</label>
                </div>
              </div>
            </div> */}
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full py-3 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45"
                />
              </div>
              {errors.email && touched.email ? <div className="text-red-500 text-sm">{errors.email}</div> : null}
              {error ? <div className="text-red-500 text-sm">{error}</div> : null}
              <button type="submit" className="w-full bg-green-500 bg-primary rounded-lg text-black font-normal py-3 rounded hover-shadow focus:outline-none">CONTINUE</button>
              <button onClick={handleGoBack}>Go Back to Login</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>

  );
};

export default SelectRole;
