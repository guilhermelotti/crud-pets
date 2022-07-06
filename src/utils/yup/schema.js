import * as yup from "yup";

export const petFormSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  type: yup.string().required("Type is required"),
  age: yup.number().required("Age is required"),
  weight: yup.number().required("Weight is required"),
  caregiverName: yup.string().required("Caregiver name is required"),
  isDocile: yup.boolean().required("You must select an option"),
  // TODO: maybe fix isDocile validation(not showing error message)
});
