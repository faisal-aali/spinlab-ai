"use client";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const roleSchema = Yup.object().shape({
  role: Yup.string().required('Role is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const SelectRole = ({ nextStep, handleChange, values }) => {

  return (
    <Formik
      initialValues={values}
      validationSchema={roleSchema}
      onSubmit={(values) => {
        handleChange("role")({ target: { value: values.role } });
        handleChange("email")({ target: { value: values.email } });
        nextStep();
      }}
    >
      {({ errors, touched, setFieldValue, values  }) => (
        <Form className={`flex items-center justify-center RegisterFormWidth bg-transparent border primary-border py-16 px-10 rounded-lg w-full `}>
          <div className="w-full">
            <h2 className="text-white font-bold mb-8 text-center text-3xl">Please select your role:</h2>
            <div className="flex justify-between mb-8">
              <button
                type="button"
                className={`w-full py-2 mr-4 px-4 rounded-md ${values.role === 'Player' ? 'bg-primary text-black' : 'backgroundDisabledColor text-white'}`}
                onClick={() => setFieldValue("role", "Player")}
              >
                Player
              </button>
              <button
                type="button"
                className={`w-full py-2 mr-4 px-4 rounded-md ${values.role === 'Trainer' ? 'bg-primary text-black' : 'backgroundDisabledColor text-white'}`}
                onClick={() => setFieldValue("role", "Trainer")}
              >
                Trainer
              </button>
              <button
                type="button"
                className={`w-full py-2 rounded-md px-4 ${values.role === 'Coach' ? 'bg-primary text-black' : 'backgroundDisabledColor text-white'}`}
                onClick={() => setFieldValue("role", "Coach")}
              >
                Coach
              </button>
            </div>
            <div className="mb-8">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="w-full py-3 px-3 bg-transparent primary-border rounded text-white rounded-lg focus:outline-none focus:outline-none focus:border-green-500 placeholder:opacity-45"
              />
              {errors.email && touched.email ? <div className="text-red-500 text-sm">{errors.email}</div> : null}
            </div>
            <button type="submit" className="w-full bg-green-500 bg-primary rounded-lg text-black font-normal py-3 rounded hover-shadow focus:outline-none">CONTINUE</button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SelectRole;
