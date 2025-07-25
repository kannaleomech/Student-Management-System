import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useRoles } from "../../hooks/useList";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: roles, isLoading: loadingRoles } = useRoles();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      cpassword: "",
      role: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(5, "Password must be at least 5 characters")
        .required("Password is required"),
      cpassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
      role: Yup.string().required("Role is required"),
    }),
    onSubmit: (values) => {
      console.log("Register form data:", values);
      const { name, email, password, role } = values;
      dispatch(registerUser({ name, email, password, role }))
        .unwrap()
        .then(() => {
          toast.success("Registration successful! 🎉");
          navigate("/dashboard");
        })
        .catch((err) => {
          toast.error(err?.error || "Registration failed. Try again.");
        });
    },
  });

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={formik.handleSubmit}>
              <h3 className="text-center mb-4">Register</h3>

              {/* Name */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-control ${
                    formik.touched.name && formik.errors.name
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Enter your name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                <label htmlFor="name">Full Name</label>
                {formik.touched.name && formik.errors.name && (
                  <div className="invalid-feedback">{formik.errors.name}</div>
                )}
              </div>

              {/* Email */}
              <div className="form-floating mb-3">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${
                    formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Enter your email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                <label htmlFor="email">Email address</label>
                {formik.touched.email && formik.errors.email && (
                  <div className="invalid-feedback">{formik.errors.email}</div>
                )}
              </div>

              {/* Password */}
              <div className="form-floating mb-3">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${
                    formik.touched.password && formik.errors.password
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Enter password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <label htmlFor="password">Password</label>
                {formik.touched.password && formik.errors.password && (
                  <div className="invalid-feedback">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              {/* confirm Password */}
              <div className="form-floating mb-3">
                <input
                  type="password"
                  id="cpassword"
                  name="cpassword"
                  className={`form-control ${
                    formik.touched.cpassword && formik.errors.cpassword
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Confirm password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.cpassword}
                />
                <label htmlFor="cpassword">Confirm Password</label>
                {formik.touched.cpassword && formik.errors.cpassword && (
                  <div className="invalid-feedback">
                    {formik.errors.cpassword}
                  </div>
                )}
              </div>

              {/* Role */}
              <div className="form-floating mb-4">
                <select
                  id="role"
                  name="role"
                  className={`form-select ${
                    formik.touched.role && formik.errors.role
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.role}
                >
                  <option value="">Select Role</option>
                  {loadingRoles ? (
                    <option value="" disabled>
                      {" "}
                      Loading classes...
                    </option>
                  ) : (
                    roles.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))
                  )}
                </select>
                <label htmlFor="role">Role</label>
                {formik.touched.role && formik.errors.role && (
                  <div className="invalid-feedback">{formik.errors.role}</div>
                )}
              </div>

              {/* Submit */}
              <div className="text-center text-lg-start mt-4 pt-2">
                <button type="submit" className="btn btn-primary btn-lg w-100">
                  Register
                </button>
                <p className="small fw-bold mt-3 mb-0">
                  Already have an account?{" "}
                  <Link to="/signin" className="link-primary">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
