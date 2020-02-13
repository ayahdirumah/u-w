import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  Platform,
  View,
  Text,
  TextInput,
  ScrollView,
  Picker,
  KeyboardAvoidingView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ReduxActions from '../actions';
import {Spinner} from '../components/Spinner';
import {NavigationActions, StackActions} from 'react-navigation';
import {decryptPass} from '../utils/utils';
import s from '../assets/styles/Styles';
import {vars} from '../assets/styles/Vars';
import ButtonPrimary from '../components/ButtonPrimary';
import ButtonBack from '../components/ButtonBack';
import HeroDesktop from '../components/HeroDesktop';
import {
  isWeb,
  isLandscape,
  isPortrait,
  isScreenDesktop,
} from '../actions/mediaQuery';

class Login extends Component {
  static navigationOptions = {
    headershown: false,
    headerMode: 'none',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      address: '',
      pin: '',
      error: '',
      errorPIN: '',
      errorAddress: '',
      label:
        Platform.OS === 'ios' || Platform.OS === 'android' ? 'PIN' : 'Password',
      isWeb: isWeb(),
      isLandscape: isLandscape(),
      isPortrait: isPortrait(),
      isScreenDesktop: isScreenDesktop(),
    };
    this.checkWallets = this.checkWallets.bind(this);
    this._isPINAllowed = this._isPINAllowed.bind(this);
    this._onButtonPress = this._onButtonPress.bind(this);

    Dimensions.addEventListener('change', () => {
      this.setState({
        isLandscape: isLandscape(),
        isPortrait: isPortrait(),
        isScreenDesktop: isScreenDesktop(),
      });
    });
  }

  checkWallets() {
    if (this.props.loginData != null) {
      this.redirectTo('dashboard');
    } else if (this.props.listWallet == null) {
      this.redirectTo('welcome');
    } else if (this.props.listWallet.length < 1) {
      this.redirectTo('welcome');
    } else {
      this.props.initLogin();
    }
  }

  componentDidMount() {
    this.checkWallets();
  }

  componentWillUnmount() {
    //
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

  setTimer() {
    this.timer = setTimeout(this.checkWallets, 700);
  }

  _onDeleteAccount = () => {
    if (this.state.address !== '') {
      this.props.deleteWalletByAddress(
        this.props.listWallet,
        this.state.address,
      );
      this.setTimer();
    }
  };

  _onValidateAddress = () => {
    return this.state.address.length > 0;
  };

  _onAddressChanged = address => {
    this.setState(
      {
        address: address,
      },
      () => {
        if (!this._onValidateAddress()) {
          this.setState({errorAddress: 'Required'});
        } else {
          this.setState({errorAddress: ''});
        }
      },
    );
  };

  _onValidatePass = () => {
    return this.state.pin.trim().length > 1;
  };

  _onPINChanged = pin => {
    this.setState({pin: pin.trim()}, () => {
      if (!this._onValidatePass()) {
        this.setState({errorPIN: 'Required'});
      } else {
        this.setState({errorPIN: ''});
      }
    });
  };

  _isPINAllowed(data, pin, callback) {
    data.is_phrase_saved = false;
    data.pin = null;
    data.fingerprint = null;
    data.use_fingerprint = false;
    data.phrase_encrypt = null;
    if (this.props.listWallet == null) {
      callback(false, data);
    } else {
      let wallets = this._getWalletStoredLocalByAddress(data.address);
      let allowed = false;
      for (let index = 0; index < wallets.length; index++) {
        if (decryptPass(wallets[index].pin) === pin) {
          allowed = true;
          data.pin = wallets[index].pin;
          data.is_phrase_saved = wallets[index].is_phrase_saved;
          data.use_fingerprint = wallets[index].use_fingerprint;
          data.fingerprint = wallets[index].fingerprint;
          data.phrase_encrypt = wallets[index].phrase_encrypt;
        }
      }
      callback(allowed, data);
    }
  }

  _getWalletStoredLocalByAddress(address) {
    if (this.props.listWallet == null) {
      return [];
    } else {
      let local = this.props.listWallet.filter(function(wallet) {
        return wallet.address === address;
      });
      return local;
    }
  }

  _onButtonPress = () => {
    const {address, pin} = this.state;
    if (!this._onValidatePass() || !this._onValidateAddress()) {
      return;
    }
    let ini;
    // eslint-disable-next-line consistent-this
    ini = this;
    this.setState({isLoading: true}, () => {
      this.props.getWalletFromServ(address, function(success, data) {
        if (!success) {
          ini.setState({
            isLoading: false,
            error: data,
          });
        } else {
          ini._isPINAllowed(data, pin, function(suc, d) {
            if (!suc) {
              ini.setState({
                isLoading: false,
                error: 'Incorrect ' + ini.state.label,
              });
            } else {
              ini.setState(
                {
                  isLoading: false,
                  error: null,
                },
                () => {
                  ini.props.setLoginData(d);
                  ini.props.setWalletList(ini.props.listWallet, d);
                  ini.redirectTo('dashboard');
                },
              );
            }
          });
        }
      });
    });
  };

  _onButtonCreatePress = () => {
    this.props.onBack(1);
    this.redirectTo('create');
  };

  render() {
    const {navigate} = this.props.navigation;
    let dropdown = this.props.listWallet;
    if (dropdown == null) {
      dropdown = [];
    }
    let address =
      dropdown.length === 1 ? dropdown[0].address : this.state.address;
    let showDeleteAccount = address !== '' ? true : false;

    if (dropdown.length > 1) {
      let em = false;
      for (var i = 0; i < dropdown.length; i++) {
        if (dropdown[i].address === '') {
          em = true;
        }
      }
      if (!em) {
        dropdown.unshift({address: ''});
      }
    }
    let dropItem = dropdown.map((wallet, index) => {
      let label =
        wallet.address !== ''
          ? wallet.name + ' : ' + wallet.address
          : 'Select a wallet address';
      return <Picker.Item label={label} value={wallet.address} key={index} />;
    });

    const logoUnity =
      this.state.isWeb &&
      this.state.isScreenDesktop &&
      this.state.isLandscape ? (
        <TouchableOpacity
          style={s.homeBrandLogo}
          activeOpacity={vars.OPACITY_TOUCH}
          onPress={() => Linking.openURL('https://www.unity.sg/')}>
          <Image
            style={{width: 221, height: 64}}
            source={require('../assets/img/unity-logo-title.png')}
          />
        </TouchableOpacity>
      ) : null;
    const buttonBack =
      this.state.isWeb &&
      (!this.state.isScreenDesktop || this.state.isPortrait) ? (
        <View style={s.homeButtonBack}>
          <ButtonBack
            title="Back to Home"
            color="#2e384d"
            onPress={() => Linking.openURL('https://www.unity.sg/')}
          />
        </View>
      ) : null;
    const heroDesktop =
      this.state.isScreenDesktop &&
      this.state.isLandscape &&
      this.state.isWeb ? (
        <HeroDesktop />
      ) : null;

    return (
      <View>
        {buttonBack}
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          {logoUnity}
          <View
            style={[
              s.container,
              s.conCenter,
              this.state.isWeb &&
              this.state.isScreenDesktop &&
              this.state.isLandscape
                ? {
                    width: vars.WIDTH_HOME_SIDEBAR,
                    overflowY: 'hidden',
                  }
                : null,
              {
                marginTop: this.state.isScreenDesktop ? 100 : 50,
                paddingBottom: this.state.isScreenDesktop ? 100 : 10,
              },
            ]}>
            <Spinner visible={this.state.isLoading} />
            <KeyboardAvoidingView
              style={s.homeWrpContent}
              behavior="padding"
              enabled={Platform.OS === 'ios'}>
              <Text style={s.textTitle}>Welcome Back!</Text>
              <Text style={[s.textBody, {marginBottom: 30}]}>
                Please sign-in below or{' '}
                <Text style={[s.textLink]} onPress={() => navigate('import')}>
                  Import Wallet
                </Text>
              </Text>

              <View style={s.inputField}>
                <View style={styles.wrpLabelInline}>
                  <Text style={s.inputLabel}>WALLET ADDRESS</Text>
                  {showDeleteAccount ? (
                    <Text
                      style={[s.textLinkDanger, styles.linkRemoveWallet]}
                      disabled={this.state.isLoading}
                      onPress={() => this._onDeleteAccount()}>
                      Remove wallet
                    </Text>
                  ) : null}
                </View>
                <Picker
                  label={'WALLET ADDRESS'}
                  placeholder="Select a wallet address"
                  placeholderTextColor={vars.COLOR_TEXT_PLACEHOLDER}
                  selectedValue={address}
                  style={[
                    s.inputPrimary,
                    this.state.errorAddress ? s.inputError : '',
                  ]}
                  onValueChange={this._onAddressChanged}>
                  {dropItem}
                </Picker>
                <Text
                  style={[
                    s.textErrorInput,
                    this.state.errorAddress ? s.isShow : s.isHide,
                  ]}>
                  {this.state.errorAddress}
                </Text>
              </View>

              <View style={s.inputField}>
                <Text style={s.inputLabel}>
                  {Platform.OS === 'ios' || Platform.OS === 'android'
                    ? 'PLEASE ENTER A PIN'
                    : 'PLEASE ENTER A PASSWORD'}
                </Text>
                <TextInput
                  label={
                    Platform.OS === 'ios' || Platform.OS === 'android'
                      ? 'PIN'
                      : 'PASSWORD'
                  }
                  placeholder=""
                  placeholderTextColor={vars.COLOR_TEXT_PLACEHOLDER}
                  style={[
                    s.inputPrimary,
                    this.state.errorPIN ? s.inputError : '',
                  ]}
                  value={this.state.pin}
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  secureTextEntry={true}
                  keyboardType={'number-pad'}
                  textContentType={'password'}
                  onChangeText={this._onPINChanged}
                />
                <Text
                  style={[
                    s.textErrorInput,
                    this.state.errorPIN ? s.isShow : s.isHide,
                  ]}>
                  {this.state.errorPIN}
                </Text>
              </View>

              <Text style={s.textError}>{this.state.error}</Text>

              <ButtonPrimary
                title="Continue"
                onPress={this._onButtonPress}
                disabled={this.state.isLoading}
              />

              <Text
                style={[
                  s.textDefault,
                  {
                    marginTop: 6,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  },
                ]}>
                Need another wallet?{' '}
                <Text style={s.textLink} onPress={() => navigate('create')}>
                  Create a new wallet
                </Text>
              </Text>
            </KeyboardAvoidingView>
          </View>
          {heroDesktop}
        </ScrollView>
      </View>
    );
  }
}

// The function takes data from the app current state,
// and insert/links it into the props of our component.
// This function makes Redux know that this component needs to be passed a piece of the state
function mapStateToProps(state) {
  return {
    error: state.loginReducer.error,
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
)(Login);

const styles = StyleSheet.create({
  wrpLabelInline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkRemoveWallet: {
    marginTop: -8,
    marginBottom: 4,
  },
});
