import * as Yup from 'yup'

const schemaValidators = {
    user: {
        email: Yup.string().email().required("Email is required"),
        height: Yup.string().test("feet/inches", "Must be in feet/inches", (str) => str.match(/^([1-2]?[0-9]{1,3})?\'(0?[0-9]|[0-1]{2})?\"$/)).required("Height is required"),
        handedness: Yup.string().oneOf(['left', 'right'], 'Handedness must be a valid string').required("Handedness is required"),
    }
}

export default schemaValidators