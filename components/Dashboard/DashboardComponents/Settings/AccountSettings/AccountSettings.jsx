import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const AccountSettings = () => {
  const [imageSrc, setImageSrc] = useState("https://placehold.co/100x100");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    age: Yup.number().required("Required"),
    height: Yup.string().required("Required"),
    handedness: Yup.string().required("Required"),
    weight: Yup.string().required("Required"),
    currentPassword: Yup.string().required("Required"),
    newPassword: Yup.string().required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Required"),
  });

  return (
    <div className="rounded-lg bg-dark-blue text-white space-y-8 mt-4">
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          age: "",
          height: "",
          handedness: "",
          weight: "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="space-y-4 primary-border rounded-lg flex items-center p-4">
              <div className="basis-2/5 flex items-center justify-between flex-col">
                <div>
                  <h2 className="text-xl font-bold">Profile Photo</h2>
                  <p className="text-gray-400">
                    This image will be displayed on your profile
                  </p>
                </div>
              </div>
              <div className="flex space-x-4 basis-3/5 primary-border rounded-lg p-8 items-center">
                <div className="basis-1/4 flex items-center justify-center">
                  <div className="relative rounded-full overflow-hidden">
                    <img
                      src={imageSrc}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center basis-3/4">
                  <div className="p-8 flex items-center justify-center flex-col dark-blue-background rounded-lg w-full gap-4 border-dashed border-2 border-slate-800">
                    <label className="cursor-pointer flex items-center justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <img src="assets/upload-icon.svg" alt="" />
                    </label>
                    <div>
                    <span className="text-primary text-lg	">Click to Upload</span>
                    <span className="text-white mx-2 text-lg	">or drag and drop</span>
                    </div>
                    <p className="text-white">
                      JPG, PNG, or GIF (Recommended size 1000x1000px)
                    </p>
                  </div>
                  <div className="flex w-full justify-end mt-2 gap-4">
                    <button
                      type="button"
                      className="text-white"
                      onClick={() =>
                        setImageSrc("https://placehold.co/100x100")
                      }
                    >
                      Cancel
                    </button>
                    <button type="button" className="text-primary pl-2">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 primary-border rounded-lg flex items-center p-4 mt-8">
              <div className="basis-2/5 flex items-center justify-between flex-col">
                <div>
                  <h2 className="text-xl font-bold">Personal Information</h2>
                  <p className="text-gray-400">
                    Update your personal details here.
                  </p>
                </div>
              </div>
              <div className="basis-3/5">
                <div className="flex items-center mb-4 gap-6">
                  <div className="w-1/2">
                    <div className="mb-1 opacity-45">
                      <label htmlFor="">First Name</label>
                    </div>
                    <div>
                      <Field
                        name="firstName"
                        className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                          errors.firstName && touched.firstName
                            ? "border-red-900	border"
                            : "primary-border focus:border-green-500"
                        }`}
                        placeholder="First Name"
                      />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="mb-1 opacity-45">
                      <label htmlFor="">Last Name</label>
                    </div>
                    <div>
                      <Field
                        name="lastName"
                        className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                          errors.lastName && touched.lastName
                            ? "border-red-900	border"
                            : "primary-border focus:border-green-500"
                        }`}
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="mb-1 opacity-45">
                    <label htmlFor="">Email</label>
                  </div>
                  <Field
                    name="email"
                    type="email"
                    className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                      errors.email && touched.email
                        ? "border-red-900	border"
                        : "primary-border focus:border-green-500"
                    }`}
                    placeholder="Email"
                  />
                </div>
                <div className="flex items-center mb-4 gap-6">
                  <div className="w-1/2">
                    <div className="mb-1 opacity-45">
                      <label htmlFor="">Age</label>
                    </div>
                    <Field
                      name="age"
                      className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                        errors.age && touched.age
                          ? "border-red-900	border"
                          : "primary-border focus:border-green-500"
                      }`}
                      placeholder="Age"
                    />
                  </div>
                  <div className="w-1/2">
                    <div className="mb-1 opacity-45">
                      <label htmlFor="">Height</label>
                    </div>
                    <Field
                      name="height"
                      className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                        errors.height && touched.height
                          ? "border-red-900	border"
                          : "primary-border focus:border-green-500"
                      }`}
                      placeholder="Height"
                    />
                  </div>
                </div>
                <div className="flex items-center mb-4 gap-6">
                  <div className="w-1/2">
                    <div className="mb-1 opacity-45">
                      <label htmlFor="">Handedness</label>
                    </div>
                    <Field
                      name="handedness"
                      className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                        errors.handedness && touched.handedness
                          ? "border-red-900	border"
                          : "primary-border focus:border-green-500"
                      }`}
                      placeholder="Handedness"
                    />
                  </div>
                  <div className="w-1/2">
                    <div className="mb-1 opacity-45">
                      <label htmlFor="">Weight</label>
                    </div>
                    <Field
                      name="weight"
                      className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                        errors.weight && touched.weight
                          ? "border-red-900	border"
                          : "primary-border focus:border-green-500"
                      }`}
                      placeholder="Weight"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 primary-border rounded-lg flex items-center p-4 mt-8">
              <div className="basis-2/5 flex items-center justify-between flex-col">
                <div>
                  <h2 className="text-xl font-bold">Password</h2>
                  <p className="text-gray-400">
                    Enter your current password to make updates.
                  </p>
                </div>
              </div>
              <div className="basis-3/5">
                <div className="flex items-center mb-4 gap-6">
                  <div className="w-48-percent">
                    <div className="mb-1 opacity-45">
                      <label htmlFor="">Current Password</label>
                    </div>
                    <div className="relative">
                      <Field
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                          errors.currentPassword && touched.currentPassword
                            ? "border-red-900 border"
                            : "primary-border focus:border-green-500"
                        }`}
                        placeholder="Enter current password"
                      />
                      <div
                        className="absolute inset
                        right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center mb-4 gap-6">
                  <div className="w-1/2">
                    <div className="mb-1 opacity-45">
                      <label htmlFor="">New Password</label>
                    </div>
                    <div className="relative">
                      <Field
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                          errors.newPassword && touched.newPassword
                            ? "border-red-900 border"
                            : "primary-border focus:border-green-500"
                        }`}
                        placeholder="Enter new password"
                      />
                      <div
                        className="absolute inset right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </div>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="mb-1 opacity-45">
                      <label htmlFor="">Confirm Password</label>
                    </div>
                    <div className="relative">
                      <Field
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className={`w-full py-3 px-3 dark-blue-background rounded-lg text-white focus:outline-none placeholder:opacity-45 ${
                          errors.confirmPassword && touched.confirmPassword
                            ? "border-red-900 border"
                            : "primary-border focus:border-green-500"
                        }`}
                        placeholder="Confirm"
                      />
                      <div
                        className="absolute inset right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                className="bg-white dark-blue-color px-4 py-1 rounded font-bold uppercase text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary dark-blue-color px-4 py-1 rounded font-bold uppercase text-sm"
              >
                Confirm
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AccountSettings;
