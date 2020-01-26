import React, { Component } from 'react';
import { Formik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import swal from "sweetalert";

const SignupSchema = Yup.object().shape({

  username: Yup.string()
    .min(2, "username is Too Short!")
    .max(50, "username is Too Long!")
    .required("username is Required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is Required"),
  password: Yup.string().required("Password is required"),
  confirm_password: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Both password need to be the same"
  )

});

class Register extends Component {

  submitForm = (values, history) => {
    axios
      .post("http://localhost:8080/register", values)
      .then(res => {
        console.log(res.data.result);
        if (res.data.result === "success") {
          swal("Success!", res.data.message, "success")
            .then(value => {
              history.push("/login");
            });
        } else if (res.data.result === "error") {
          swal("Error!", res.data.message, "error");
        }
      })
      .catch(error => {
        console.log(error);
        swal("Error!", "Unexpected error", "error");
      });
  };

  showForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    isSubmitting
  }) => {

    return (
      <form onSubmit={handleSubmit} >

        {errors.username && touched.username ? (
          <small id="passwordHelp" className="text-danger">
            {errors.username}
          </small>
        ) : null}


        <div className="input-group mb-3">
          <input
            type="text"
            name="username"
            onChange={handleChange}
            value={values.username}
            placeholder="Username"
            className={
              errors.username && touched.username
                ? "form-control is-invalid"
                : "form-control"
            }
          />

          <div className="input-group-append">
            <div className="input-group-text">
              <span className="fas fa-user" />
            </div>
          </div>
        </div>


        {errors.email && touched.email ? (
          <small id="passwordHelp" className="text-danger">
            {errors.email}
          </small>
        ) : null}

        <div className="input-group mb-3">
          <input
            type="text"
            name="email"
            onChange={handleChange}
            value={values.email}
            placeholder="Email"
            className={
              errors.email && touched.email
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <span className="fas fa-envelope" />
            </div>
          </div>
        </div>

        {errors.password && touched.password ? (
          <small id="passwordHelp" className="text-danger">
            {errors.password}
          </small>
        ) : null}
        <div className="input-group mb-3">
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={values.password}
            placeholder="Password"
            className={
              errors.password && touched.password
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <span className="fas fa-lock" />
            </div>
          </div>
        </div>

        {errors.confirm_password && touched.confirm_password ? (
          <small id="passwordHelp" className="text-danger">
            {errors.confirm_password}
          </small>
        ) : null}
        <div className="input-group mb-3">
          <input
            type="password"
            name="confirm_password"
            onChange={handleChange}
            placeholder="Confirm Password"
            className={
              errors.confirm_password && touched.confirm_password
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <span className="fas fa-lock" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <div className="icheck-primary">
              <input type="checkbox"
                id="agreeTerms"
                name="terms"
                defaultValue="agree"
                onChange={handleChange}
                className="form-control"
              />

              <label htmlFor="agreeTerms">
                I agree to the <a href="#">terms</a>
              </label>

            </div>
          </div>
          {/* /.col */}
          <div className="col-4">
            <button
              disabled={isSubmitting}
              type="submit"
              className="btn btn-primary btn-block"
            >
              Register
              </button>
          </div>
          {/* /.col */}
        </div>
      </ form>
    );
  }

  render() {
    return (
      <div className="register-page">
        <div className="register-box">
          <div className="register-logo">
            <a href="../../index2.html"><b>Business</b>GSA</a>
          </div>
          <div className="card">
            <div className="card-body register-card-body">
              <p className="login-box-msg">Register a new membership</p>

              <Formik
                initialValues={{
                  username: "",
                  email: "",
                  password: "",
                  confirm_password: ""
                }}

                onSubmit={(values, { setSubmitting }) => {
                  console.log(values);
                  this.submitForm(values, this.props.history);
                  setSubmitting(false);
                }}

                validationSchema={SignupSchema}
              >
                {props => this.showForm(props)}
              </Formik>

              <a href="login.html" className="text-center">I already have a membership</a>
            </div>
            {/* /.form-box */}
          </div>{/* /.card */}
          {/* /.register-box */}
        </div>
      </div>
    )
  }
}

export default Register;
