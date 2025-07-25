import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAddStudent } from "../../hooks/useStudent";
import { useClasses } from "../../hooks/useList";
import {
  genderOptions,
  MAX_FILE_SIZE,
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
    .matches(/^\d{10}$/, "Mobile number must be 10 digits") // Adjust regex as needed
    .required("Mobile number is required"),
  profile: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "File too large (max 1MB)",
      (value) => !value || value.size <= MAX_FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported format (jpg, png, webp only)",
      (value) => !value || SUPPORTED_TYPES.includes(value.type)
    ),
});

export default function AddStudent() {
  const navigate = useNavigate();
  const { mutate, isLoading } = useAddStudent(); // make sure this posts multipart/form-data
  const { data: classes, isLoading: loadingClasses } = useClasses();

  const [preview, setPreview] = useState(null);

  const initialValues = {
    name: "",
    class: "",
    gender: "",
    mobile: "",
    state: "",
    city: "",
    profile: null,
  };

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("class", values.class);
    formData.append("gender", values.gender);
    formData.append("mobile", values.mobile);
    formData.append("state", values.state);
    formData.append("city", values.city);
    if (values.profile) formData.append("profile", values.profile);

    mutate(formData, {
      onSuccess: () => navigate("/students"),
    });
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0">
        <div className="card-header">
          <h3 className="my-2 text-center">Create Student</h3>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form>
              <div className="card-body">
                <div className="row g-4">
                  {/* Profile Image Upload + Preview */}
                  <div className="col-md-4">
                    <div className="mb-3">
                      <div className="position-relative d-inline-block">
                        <img
                          src={
                            preview ||
                            `${
                              import.meta.env.VITE_APP_Image_URL
                            }/default/default.png`
                          }
                          alt="profile-preview"
                          className="img-fluid rounded-circle border"
                          style={{
                            width: 180,
                            height: 180,
                            objectFit: "cover",
                          }}
                        />
                      </div>
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
                          setFieldValue("profile", file || null);
                          setPreview(file ? URL.createObjectURL(file) : null);
                        }}
                      />
                      <ErrorMessage
                        name="profile"
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
                  {isLoading || isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
