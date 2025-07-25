import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useClasses } from "../../hooks/useList";
import { useStudent, useUpdateStudent } from "../../hooks/useStudent";
import {
  genderOptions,
  stateCityData,
  SUPPORTED_TYPES,
} from "../../helper/commonData";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  class: Yup.string().required("Class is required"),
  gender: Yup.string()
    .oneOf(["male", "female", "other"])
    .required("Gender is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  mobile: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  profileNew: Yup.mixed()
    .nullable()
    .test(
      "fileFormat",
      "Unsupported format (jpg, png, webp only)",
      (value) => !value || SUPPORTED_TYPES.includes(value.type)
    ),
});

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: student, isLoading: loadingStudent } = useStudent(id);
  const { mutate, isLoading } = useUpdateStudent();
  const { data: classes, isLoading: loadingClasses } = useClasses();

  const [preview, setPreview] = useState(null);
  // Populate initial values from API data
  const defaultValues = {
    name: "",
    class: "",
    gender: "",
    mobile: "",
    state: "",
    city: "",
    profileNew: null,
  };

  const initialValues = student
    ? { ...defaultValues, ...student }
    : defaultValues;

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("class", values.class);
    formData.append("gender", values.gender);
    formData.append("mobile", values.mobile);
    formData.append("state", values.state);
    formData.append("city", values.city);
    if (values.profileNew) formData.append("profileNew", values.profileNew);

    mutate(
      { id, formData },
      {
        onSuccess: () => navigate("/students"),
      }
    );
  };

  if (loadingStudent) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0">
        <div className="card-header">
          <h3 className="my-2">Update Student</h3>
        </div>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form>
              <div className="card-body">
                <div className="row g-4">
                  {/* Profile Image Upload + Preview */}
                  <div className="col-md-4 text-center">
                    <div className="mb-3">
                      <img
                        src={
                          preview ||
                          (student?.profile
                            ? `${import.meta.env.VITE_APP_Image_URL}/student/${
                                student.profile
                              }`
                            : `${
                                import.meta.env.VITE_APP_Image_URL
                              }/default/default.png`)
                        }
                        alt="profile-preview"
                        className="img-fluid rounded-circle border"
                        style={{ width: 180, height: 180, objectFit: "cover" }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Profile Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => {
                          const file = e.currentTarget.files?.[0];
                          setFieldValue("profileNew", file || null);
                          setPreview(file ? URL.createObjectURL(file) : null);
                        }}
                      />
                      <ErrorMessage
                        name="profileNew"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="col-md-8">
                    <div className="row g-4">
                      {/* Name */}
                      <div className="col-md-6">
                        <label className="form-label">Name</label>
                        <Field
                          name="name"
                          className="form-control"
                          placeholder="Enter name"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </div>

                      {/* Class */}
                      <div className="col-md-6">
                        <label className="form-label">Class</label>
                        <Field as="select" name="class" className="form-select">
                          <option value="">Select Class</option>
                          {loadingClasses ? (
                            <option value="" disabled>
                              Loading classes...
                            </option>
                          ) : (
                            classes.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))
                          )}
                        </Field>
                        <ErrorMessage
                          name="class"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </div>

                      {/* Mobile */}
                      <div className="col-md-6 pt-1">
                        <label className="form-label">Mobile Number</label>
                        <Field
                          name="mobile"
                          type="text"
                          className="form-control"
                          placeholder="Enter mobile number"
                        />
                        <ErrorMessage
                          name="mobile"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </div>

                      {/* Gender */}
                      <div className="col-md-6 pt-1">
                        <label className="form-label">Gender</label>
                        <Field
                          as="select"
                          name="gender"
                          className="form-select"
                        >
                          {genderOptions.map((gender) => (
                            <option key={gender.value} value={gender.value}>
                              {gender.label}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="gender"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </div>
                      {/* City  */}
                      <div className="col-md-6 pt-1">
                        <label className="form-label">City</label>
                        <Field
                          name="city"
                          type="text"
                          className="form-control"
                          placeholder="Enter city"
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </div>

                      {/* State */}
                      <div className="col-md-6 pt-1">
                        <label className="form-label">State</label>
                        <Field
                          name="state"
                          type="text"
                          className="form-control"
                          placeholder="Enter state"
                        />
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer d-flex gap-2 justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/students")}
                  disabled={isLoading || isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading || isSubmitting ? "Updating..." : "Update"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
