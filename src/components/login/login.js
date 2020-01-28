import React, { Component } from 'react';
import { Formik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import swal from "sweetalert";
import apis from '../apis/apis';

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is Required"),
  password: Yup.string().required("Password is required")
});

class Login extends Component {

  componentDidMount() {
    if (localStorage.getItem("TOKEN_KEY") != null) {
      return this.props.history.goBack();
    }
  }

  submitForm = (values, history) => {
    apis
      .post("/login", values)
      .then(res => {
        if (res.data.result === "success") {
          localStorage.setItem("TOKEN_KEY", res.data.token);
          swal("Success!", res.data.message, "success")
            .then(value => {
              history.push("/dashboard");
            });
        } else if (res.data.result === "error") {
          swal("Error!", res.data.message, "error");
        }
      })
      .catch(error => {
        console.log(error);
        swal("Error!", error, "error");
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

        <div className="row">
          <div className="col-8">
            <div className="icheck-primary">
              <input
                type="checkbox"
                id="remember" />
              <label htmlFor="remember">
                Remember Me
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
              Sign in
              </button>
          </div>
          {/* /.col */}
        </div>
      </ form>
    );
  }


  render() {
    return (
      <div className="login-page">
        <div className="login-box">
          <div className="login-logo">
            <a href="../../index2.html"><b>Business</b>GSA</a>
          </div>
          {/* /.login-logo */}
          <div className="card">
            <div className="card-body login-card-body">
              <p className="login-box-msg">Sign in to start your session</p>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
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
              <p className="mb-1">
                <a href="forgot-password.html">I forgot my password</a>
              </p>
              <p className="mb-0">
                <a href="register.html" className="text-center">Register a new membership</a>
              </p>
            </div>
            {/* /.login-card-body */}
          </div>
        </div>
      </div>
    )
  }
}

export default Login;
