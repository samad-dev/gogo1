
import IntlMessages from "Util/IntlMessages";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";

import { Colxx } from "Components/CustomBootstrap";
import React, { useEffect, useState,Fragment } from 'react';
import Axios from "axios";
// import "../App.css";
// import { useHistory } from "react-router-dom";

export default function Login() {
  const [loginStatus, setLoginStatus] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
 
  Axios.defaults.withCredentials = true;
  // let history = useHistory();
  const login = () => {
    Axios.post("http://localhost:3001/loginn", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        console.log(response.data[0].username);  
        // history.push("/start");
        setLoginStatus(response.data[0].username);
      }
    });
  };

 
// export default class LoginLayout_1 extends Component {
    // onUserLogin() {
    //     history.push('/');
    //   }
    // render() {
        return (
          <Fragment>
            <div className="fixed-background" />
            <main>
              <div className="container">
                <Row className="h-100">
                  <Colxx xxs="12" md="10" className="mx-auto my-auto">
                    <Card className="auth-card">
                      <div className="position-relative image-side ">
                        <p className="text-white h2">MAGIC IS IN THE DETAILS</p>
                        <p className="white mb-0">
                          Please use your credentials to login.
                          <br />
                          If you are not a member, please{" "}
                          <NavLink to={`/register`} className="white">
                            register
                          </NavLink>
                          .
                        </p>
                      </div>
                      <div className="form-side">
                        <NavLink to={`/`} className="white">
                          <span className="logo-single" />
                        </NavLink>
                        <CardTitle className="mb-4">
                          <IntlMessages id="user.login-title" />
                        </CardTitle>
                        <Form>
                          <Label className="form-group has-float-label mb-4">
                            <Input type="email" onChange={(e) => {
            setUsername(e.target.value);
          }}  />
                            <IntlMessages id="user.email" />
                          </Label>
                          <Label className="form-group has-float-label mb-4">
                            <Input type="password" onChange={(e) => {
            setPassword(e.target.value);
          }}  />
                            <IntlMessages
                              id="user.password"
                            />
                          </Label>
                          <div className="d-flex justify-content-between align-items-center">
                            <NavLink to={`/forgot-password`}>
                              <IntlMessages id="user.forgot-password-question" />
                            </NavLink>
                            <Button
                              color="primary"
                              className="btn-shadow"
                              size="lg"
                              type="button" onClick={login}
                            >
                              <IntlMessages  id="user.login-button" />
                            </Button >
                          </div>
      <h1>{loginStatus}</h1>

                        </Form>
                      </div>
                    </Card>
                  </Colxx>
                </Row>
              </div>
            </main>
          </Fragment>
        );
      }
