"use client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { getNames } from "country-list";
import { MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import axios, { AxiosError } from 'axios'
import { signIn, signOut } from "next-auth/react";

const accountSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(
      /^(?=.*[a-zA-Z])[a-zA-Z0-9\s]*$/,
      "First name must contain at least one letter and can only contain letters and numbers"
    )
    .required("First name is required"),
  lastName: Yup.string()
    .matches(
      /^(?=.*[a-zA-Z])[a-zA-Z0-9\s]*$/,
      "Last name must contain at least one letter and can only contain letters and numbers"
    )
    .required("Last name is required"),
  city: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, "City must contain only alphabets")
    .required("City is required"),
  country: Yup.string().required("Country is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const CreateAccount = ({ nextStep, values }) => {
  const [error, setError] = useState('')
  const countries = getNames();

  const onSubmit = (values) => {
    return new Promise((resolve, reject) => {
      if (!values) reject('Invalid request')

      axios.post(values.role === 'player' ? "/api/players" : values.role === 'trainer' ? "/api/trainers" : "invalid_role", {
        ...values,
        name: `${values.firstName} ${values.lastName}`.trim()
      }).then(res => {
        resolve('User created')
      }).catch(err => {
        console.error(err)
        reject(`Error occured: ${(err.response.data.message || err.message)}`)
      })
    })
  }

  return (
    <Formik
      initialValues={values}
      validationSchema={accountSchema}
      onSubmit={(values) => {
        console.log("Account Details:", values);
        onSubmit(values).then(async res => {
          await signIn('credentials', { email: values.email, password: values.password, redirect: false }).catch(err => signOut({ redirect: false }))
          nextStep();
        }).catch(err => {
          setError(err)
        })
      }}
    >
      {({ errors, touched, setFieldValue }) => (
        <div className="bg-transparent border primary-border rounded-lg max-w-7xl ">
          <Form className="w-full p-8">
            <h2 className="text-white text-3xl font-bold mb-6 text-center">
              Create your Account
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex gap-6">
                <div className="w-1/2">
                  <Field
                    name="firstName"
                    className="w-full py-3 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45"
                    placeholder="First Name"
                  />
                  {errors.firstName && touched.firstName ? (
                    <div className="text-red-500 text-sm">
                      {errors.firstName}
                    </div>
                  ) : null}
                </div>
                <div className="w-1/2">
                  <Field
                    name="lastName"
                    className="w-full py-3 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45"
                    placeholder="Last Name"
                  />
                  {errors.lastName && touched.lastName ? (
                    <div className="text-red-500 text-sm">
                      {errors.lastName}
                    </div>
                  ) : null}
                </div>
              </div>
              <div>
                <Field
                  name="city"
                  className="w-full py-3 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45"
                  placeholder="City"
                />
                {errors.city && touched.city ? (
                  <div className="text-red-500 text-sm">{errors.city}</div>
                ) : null}
              </div>
              <div className="">
                {/* <Field
                  name="country"
                  as="select"
                  className="w-full py-3 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45"
                >
                  <option
                    className="bg-black"
                    value=""
                    label="Select Country"
                  />
                  {countries.map((country) => (
                    <option
                      className="bg-black"
                      key={country}
                      value={country}
                      label={country}
                    />
                  ))}
                </Field> */}
                <TextField variant="filled" select fullWidth label='Country' onChange={(e) => setFieldValue('country', e.target.value)}>
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>{country}</MenuItem>
                  ))}
                </TextField>
                {errors.country && touched.country ? (
                  <div className="text-red-500 text-sm">{errors.country}</div>
                ) : null}
              </div>
              <div>
                <Field
                  name="password"
                  type="password"
                  className="w-full py-3 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45"
                  placeholder="Password"
                />
                {errors.password && touched.password ? (
                  <div className="text-red-500 text-sm">{errors.password}</div>
                ) : null}
              </div>
              <div>
                <Field
                  name="confirmPassword"
                  type="password"
                  className="w-full py-3 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45"
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && touched.confirmPassword ? (
                  <div className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </div>
                ) : null}
              </div>
              <div className={`text-error ${!error && 'hidden'}`}>
                {error}
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-green-500 bg-primary rounded-lg w-80 text-black font-normal px-3 py-3 rounded hover-shadow focus:outline-none"
                >
                  CONTINUE
                </button>
              </div>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default CreateAccount;
