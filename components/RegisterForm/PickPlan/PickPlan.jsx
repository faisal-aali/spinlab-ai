"use client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import styles from "./PickPlan.module.css";

const planSchema = Yup.object().shape({
  plan: Yup.string().required("Plan is required"),
});

const PickPlan = ({ nextStep, handleChange, values }) => {

  const checkmark = '/assets/checkmark.png';

  return (
    <Formik
      initialValues={values}
      validationSchema={planSchema}
      onSubmit={(values) => {
        handleChange("plan")({ target: { value: values.plan } });
        nextStep();
        console.log("Selected Plan:", values.plan);
      }}
    >
      {({ errors, touched, setFieldValue, values }) => (
        <div className="bg-transparent border primary-border rounded-lg max-w-7xl">
          <Form className="w-full">
            <div className="w-full p-8">
              <h2 className="text-white text-3xl font-bold mb-2 text-center">
                Pick your plan
              </h2>
              <p className="text-zinc-400 mb-6 text-center">
                Start your 7 days free trial today.
              </p>
              <div className="mb-6">
                <div
                  className={`relative p-4 mb-8 flex items-center gap-12 cursor-pointer border primary-border rounded-lg ${values.plan === "monthly" ? "hover-shadow-dark" : "hover-shadow-light"
                    }`}
                  onClick={() => setFieldValue("plan", "monthly")}
                >
                  {values.plan === "monthly" && (
                    <img
                      src={checkmark}
                      alt="Selected"
                      className={`absolute ${styles.checkmarkPosition} w-16 h-16`}
                    />
                  )}
                  <div className={`blueBackground ${styles.priceTotalWrapper}  py-10 px-12`}>
                    <h3 className="text-white text-2xl mt-2">Monthly</h3>
                    <p className="text-primary text-3xl font-bold">$99.99</p>
                  </div>
                  <div>
                    <ul className="text-zinc-400">
                      <li className="mb-4 text-white">
                        <span className="text-primary">1. Performance Tracking:</span> Monitor player statistics and
                        trends to identify strengths, weaknesses, and areas for
                        improvement.
                      </li>
                      <li className="mb-4 text-white">
                        <span className="text-primary">2. Tactical Insights:</span> Analyze gameplay patterns to
                        optimize strategies and adapt game plans for competitive
                        advantage.
                      </li>
                      <li className="mb-4 text-white">
                        <span className="text-primary">3. Injury Prevention:</span> Utilize data to manage player
                        workload, track fatigue levels, and reduce the risk of
                        injuries through informed decision-making.
                      </li>
                      <li className="text-white">
                        <span className="text-primary">4. Talent Development:</span> Identify promising players, track
                        their progress, and tailor training programs to maximize
                        their potential.
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  className={`relative p-4 mb-8 flex items-center gap-12 cursor-pointer border primary-border rounded-lg ${values.plan === "annual" ? "hover-shadow-dark" : "hover-shadow-light"
                    }`}
                  onClick={() => setFieldValue("plan", "annual")}
                >
                  {values.plan === "annual" && (
                    <img
                      src={checkmark}
                      alt="Selected"
                      className={`absolute ${styles.checkmarkPosition} w-16 h-16`}
                    />
                  )}
                  <div className={`blueBackground ${styles.priceTotalWrapper}  py-10 px-12`}>
                    <h3 className="text-white text-2xl mt-2">Annual</h3>
                    <p className="text-primary text-3xl font-bold">$460</p>
                  </div>
                  <div>
                    <ul className="text-zinc-400">
                      <li className="mb-4 text-white">
                        <span className="text-primary">1. Performance Tracking:</span> Monitor player statistics and
                        trends to identify strengths, weaknesses, and areas for
                        improvement.
                      </li>
                      <li className="mb-4 text-white">
                        <span className="text-primary">2. Tactical Insights:</span> Analyze gameplay patterns to
                        optimize strategies and adapt game plans for competitive
                        advantage.
                      </li>
                      <li className="mb-4 text-white">
                        <span className="text-primary">3. Injury Prevention:</span> Utilize data to manage player
                        workload, track fatigue levels, and reduce the risk of
                        injuries through informed decision-making.
                      </li>
                      <li className="text-white">
                        <span className="text-primary">4. Talent Development:</span> Identify promising players, track
                        their progress, and tailor training programs to maximize
                        their potential.
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  className={`relative p-4 flex items-center gap-12 cursor-pointer border primary-border rounded-lg ${values.plan === "free" ? "hover-shadow-dark" : "hover-shadow-light"
                    }`}
                  onClick={() => setFieldValue("plan", "free")}
                >
                  {values.plan === "free" && (
                    <img
                      src={checkmark}
                      alt="Selected"
                      className={`absolute ${styles.checkmarkPosition} w-16 h-16`}
                    />
                  )}
                  <div className={`blueBackground ${styles.priceTotalWrapper}  py-10 px-12`}>
                    <h3 className="text-white text-2xl mt-2">Free</h3>
                  </div>
                  <div>
                    <ul className="text-zinc-400">
                      <li className="mb-4 text-white">
                        <span className="text-primary">1. Performance Tracking:</span> Monitor player statistics and
                        trends to identify strengths, weaknesses, and areas for
                        improvement.
                      </li>
                      <li className="mb-4 text-white">
                        <span className="text-primary">2. Tactical Insights:</span> Analyze gameplay patterns to
                        optimize strategies and adapt game plans for competitive
                        advantage.
                      </li>
                      <li className="mb-4 text-white">
                        <span className="text-primary">3. Injury Prevention:</span> Utilize data to manage player
                        workload, track fatigue levels, and reduce the risk of
                        injuries through informed decision-making.
                      </li>
                      <li className="text-white">
                        <span className="text-primary">4. Talent Development:</span> Identify promising players, track
                        their progress, and tailor training programs to maximize
                        their potential.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {errors.plan && touched.plan ? (
                <div className="text-red-500 text-sm">{errors.plan}</div>
              ) : null}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-primary rounded-lg w-80 text-black font-normal px-3 py-3 rounded hover-shadow focus:outline-none"
                >
                  CONTINUE: SELECT PLAN
                </button>
              </div>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default PickPlan;
