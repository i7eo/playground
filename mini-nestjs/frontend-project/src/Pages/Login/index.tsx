import { Button, Form, Icon, Input, message } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import Axios from "axios";
import qs from "qs";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./style.css";

interface IFormFields {
  password: string;
}

interface IProps {
  form: WrappedFormUtils<IFormFields>;
}

class LoginForm extends Component<IProps> {
  state = {
    isLogin: false,
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const {
          data: { data: isLoginSuccess, msg },
        } = await Axios.post("/api/login", qs.stringify({ ...values }), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        if(!isLoginSuccess) {
          message.error(msg);
        }else{
          message.success(msg);
        }
        this.setState({
          isLogin: isLoginSuccess
        })
      }
    });
  };

  render() {
    const { isLogin } = this.state;
    const { getFieldDecorator } = this.props.form;
    return isLogin ? (
      <Redirect to="/" />
    ) : (
      <section className="page-login">
        <h1>Welcome Crowller Admin</h1>
        <div className="login">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [{ required: true, message: "请输入密码" }],
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="Password"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登陆
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    );
  }
}

const WrappedLoginForm = Form.create({ name: "login_form" })(LoginForm);

export default WrappedLoginForm;
