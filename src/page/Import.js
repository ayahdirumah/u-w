import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ReduxActions from '../actions';
import {View} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import {WavesAPI, NET_CONFIG} from '../utils/WavesAPI';
import RegisterScreen1 from '../components/RegisterScreen1';
import RegisterScreen2 from '../components/RegisterScreen2';
import '../../shim.js';
import crypto from 'crypto';

const Waves = WavesAPI.create(NET_CONFIG);

class Import extends Component {
  static navigationOptions = {
    headershown: false,
    headerMode: 'none',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      name: '',
      password: '',
      confirm_password: '',
      email: '',
      telegram_id: '',
    };

    this.seed = Waves.Seed.create();
    this.onNextHandler = this.onNextHandler.bind(this);
    this.onBackHandler = this.onBackHandler.bind(this);
  }

  onNextHandler() {
    this.props.onNext(this.props.screen + 1);
  }

  onBackHandler() {
    this.props.onBack(this.props.screen > 1 ? this.props.screen - 1 : 1);
  }

  componentDidMount() {
    if (this.props.loginData != null) {
      this.redirectTo('home');
    } else {
      this.props.setAddress(this.seed.address);
      this.props.setPhrase(this.seed.phrase);
    }
  }

  redirectTo(page, params) {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: page,
            params: params,
          }),
        ],
      }),
    );
  }

  render() {
    const {screen} = this.props;
    return (
      <View>
        {screen === 1 && (
          <RegisterScreen1
            onNextHandler={this.onNextHandler}
            onBackHandler={this.onBackHandler}
            seed={this.seed}
            {...this.props}
          />
        )}
        {screen === 2 && (
          <RegisterScreen2
            onNextHandler={this.onNextHandler}
            onBackHandler={this.onBackHandler}
            seed={this.seed}
            {...this.props}
          />
        )}
      </View>
    );
  }
}

// The function takes data from the app current state,
// and insert/links it into the props of our component.
// This function makes Redux know that this component needs to be passed a piece of the state
function mapStateToProps(state, props) {
  return {
    signup_data: state.registerReducer.signup_data,
    address: state.registerReducer.address,
    phrase: state.registerReducer.phrase,
    is_phrase_saved: state.registerReducer.is_phrase_saved,
    screen: state.registerReducer.screen,
    error: state.registerReducer.error,
    wallet: state.registerReducer.wallet,
    listWallet: state.loginReducer.listWallet,
    loginData: state.loginReducer.loginData,
  };
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in out actions file (action/home.js)
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ReduxActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Import);
