import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Spinner from '../../components/UI/Spinner';
import classes from './index.css';
import * as actions from '../../store/actions/index';

class Auth extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      controls: {
        email: {
          elementType: 'input',
          elementConfig: {
            type: 'email',
            placeholder: 'Mail Address'
          },
          value: '',
          validation: {
            required: true,
            isEmail: true
          },
          valid: false,
          touched: false
        },
        password: {
          elementType: 'input',
          elementConfig: {
            type: 'password',
            placeholder: 'Password'
          },
          value: '',
          validation: {
            required: true,
            minLength: 6
          },
          valid: false,
          touched: false
        }
      },
      isSignUp: true
    }
  }
  
  checkValidity = (value, rules) => {
    let isValid = true;
    
    if (!rules) {
      return true;
    }
    
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }
    
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }
    
    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }
    
    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }
    
    return isValid;
  };
  
  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
        touched: true
      }
    };
    this.setState({controls: updatedControls})
  };
  
  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignUp);
  };
  
  switchAuthHandler = () => {
    this.setState(prevState => {
      return {
        isSignUp: !prevState.isSignUp
      }
    })
  };
  
  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      if (this.state.controls.hasOwnProperty(key))  {
        formElementsArray.push({
          id: key,
          config: this.state.controls[key]
        })
      }
    }
    
    let form = formElementsArray.map(formElement => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
        changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
    ));
    
    if (this.props.loading) {
      form = <Spinner/>
    }
    
    let errorMessage = null;
      
    if (this.props.error) {
      errorMessage = (
        <p>{this.props.error.message}</p>
      )
    }
    
    return (
      <div className={classes.Auth}>
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
        <Button clicked={this.switchAuthHandler}
          btnType="Danger">Switch to {this.state.isSignUp ? 'SignIn' : 'SignUp'}</Button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp))
  }
};

Auth.propTypes = {
  checkValidity: PropTypes.func,
  inputChangedHandler: PropTypes.func,
  submitHandler: PropTypes.func,
  switchAuthHandler: PropTypes.func,
  controls: PropTypes.objectOf(PropTypes.object),
  isSignUp: PropTypes.bool,
  email: PropTypes.object,
  password: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);