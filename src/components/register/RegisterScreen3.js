import React, {Component} from 'react';
import {
  Dimensions,
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  Image,
  Clipboard,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import SeedBackupModal from '../SeedBackupModal';
import {Field, reduxForm} from 'redux-form';
import {Spinner} from '../Spinner';
import {NavigationActions, StackActions} from 'react-navigation';
import IconEyeSlash from '../icon/IconEyeSlash';
import ButtonDanger from '../ButtonDanger';
import s from '../../assets/styles/Styles';
import {vars} from '../../assets/styles/Vars';
import {isScreenDesktop} from '../../actions/mediaQuery';

class RegisterScreen2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      error: '',
      isModalVisible: false,
      correctPhraseOrder: false,
      isScreenDesktop: isScreenDesktop(),
    };

    Dimensions.addEventListener('change', () => {
      this.setState({
        isScreenDesktop: isScreenDesktop(),
      });
    });

    this.refs.ListView_Reference.scrollTo({animated: false}, 0);
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

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  phraseOrder = a => {
    this.props.setPhraseSaved(a ? true : false);
  };

  _onButtonPress = () => {
    let ini;
    // eslint-disable-next-line consistent-this
    ini = this;
    this.setState({isLoading: true}, () => {
      this.props.saveRegister(this.props.signup_data, function(success, data) {
        if (!success) {
          ini.setState({
            isLoading: false,
            error: data,
          });
        } else {
          data.pin = ini.props.signup_data.pin;
          data.use_fingerprint = ini.props.signup_data.use_fingerprint;
          data.fingerprint = ini.props.signup_data.fingerprint;
          data.is_phrase_saved = ini.props.signup_data.is_phrase_saved;
          data.phrase_encrypt = ini.props.signup_data.phrase_encrypt;
          ini.props.setAddress(null);
          ini.props.setPhrase(null);
          ini.props.setSignupData(null);
          ini.props.onBack(1);
          ini.props.setLoginData(data);
          ini.props.setWalletList(ini.props.listWallet, data);
          ini.redirectTo('dashboard');
        }
      });
    });
  };

  _onButtonSavedModal = e => {};

  render() {
    const {handleSubmit} = this.props;

    return (
      <ScrollView
        style={{backgroundColor: vars.COLOR_BG_PRIMARY}}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps={'handled'}>
        <SeedBackupModal
          isVisible={this.state.isModalVisible}
          toggleModal={this.toggleModal}
          phraseOrder={this.phraseOrder}
          _onButtonPress={this._onButtonPress}
          {...this.props}
        />
        <View
          style={[
            s.container,
            s.conCenter,
            styles.containerSeed,
            {paddingHorizontal: this.state.isScreenDesktop ? 28 : '5%'},
          ]}>
          <Spinner visible={this.state.isLoading} />
          <Image
            style={{width: 221, height: 64, alignSelf: 'center'}}
            source={require('../../assets/img/unity-logo-title.png')}
          />

          <Text
            style={[
              styles.messageTitle,
              {fontSize: this.state.isScreenDesktop ? 28 : 26},
            ]}>
            Your secure wallet has been successfully created.
          </Text>
          <Text style={styles.logoTextSubTitle}>
            Please click{' '}
            <IconEyeSlash
              style={styles.subtitleIcon}
              fill={vars.COLOR_PRIMARY}
            />{' '}
            below to reveal your Backup Seed Phrase and write or copy this
            somewhere secure that only you can access.
          </Text>

          <View style={styles.wrpWarning}>
            <Text style={styles.warningTitle}>Security</Text>
            <Text style={styles.warningMessage}>
              The password you set only allows access to your wallet from this
              device because your private data is stored securely on your local
              devices. The password you set is only for login on this device but
              your seed is needed so you can always access your wallet in the
              future. DO NOT LOSE IT.
            </Text>
          </View>

          <View style={styles.wrpWarning}>
            <Text style={styles.warningTitle}>Do not share</Text>
            <Text style={styles.warningMessage}>
              Your Backup Seed Phrase allows you to access your wallet but would
              also allow other access to your funds. Beware of phishing and
              scams.
            </Text>
          </View>

          <View style={styles.wrpWarning}>
            <Text style={styles.warningTitle}>Belongs to you</Text>
            <Text style={styles.warningMessage}>
              Your wallet is extremely secure and our team has no access to it.
              This means we can not help recover it and we will never ask you
              for this.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              s.boxDash,
              {
                maxWidth: 350,
                paddingTop: 20,
                paddingBottom: 12,
                paddingHorizontal: 30,
                marginVertical: this.state.isScreenDesktop ? 40 : 20,
              },
            ]}
            activeOpacity={vars.OPACITY_TOUCH}
            onPress={() => this.toggleModal()}>
            <IconEyeSlash style={styles.seedIcon} fill={vars.COLOR_PRIMARY} />
            <Text style={styles.seedText}>
              Click Here to Backup Seed Phrase
            </Text>
          </TouchableOpacity>

          <Text style={s.textError}>{this.state.error}</Text>

          <View style={styles.buttonAction}>
            <ButtonDanger
              title="Continue without backup"
              onPress={handleSubmit(this._onButtonPress)}
              disabled={this.state.isLoading}
            />
          </View>

          {/* <View style={styles.buttonStyle}>
            <Button
              title="Back"
              onPress={this.props.onNextHandler}
              disabled={this.state.isLoading}
            />
          </View> */}

          <Text style={s.textDefault}>
            You can view your Backup Seed Phrase and private key inside your
            profile page ahead.
          </Text>
        </View>
      </ScrollView>
    );
  }
}

export default reduxForm({
  form: 'register',
  destroyOnUnmount: true,
})(RegisterScreen2);

const styles = StyleSheet.create({
  containerSeed: {
    maxWidth: 730,
    alignSelf: 'center',
    textAlign: 'center',
    backgroundColor: '#ffffff',
  },
  messageTitle: {
    color: vars.COLOR_SUCCESS,
    lineHeight: 32,
    marginTop: 90,
    fontFamily: 'Rubik-Light',
    fontWeight: 300,
  },
  logoTextSubTitle: {
    marginTop: 20,
    marginBottom: 40,
    fontSize: 15,
    lineHeight: 22,
    color: vars.COLOR_TEXT_TITLE,
    fontFamily: 'Rubik-Regular',
  },
  subtitleIcon: {
    height: 15,
    width: 'auto',
    marginHorizontal: 3,
    transform: 'translateY(2px)',
  },
  wrpWarning: {
    marginVertical: 10,
    textAlign: 'left',
    alignSelf: 'center',
    maxWidth: 540,
  },
  warningTitle: {
    fontFamily: 'Rubik-Medium',
    fontWeight: 500,
    fontSize: 17,
    lineHeight: 20,
    color: vars.COLOR_TEXT_TITLE,
  },
  warningMessage: {
    fontFamily: 'Rubik-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: vars.COLOR_TEXT_BODY,
    marginVertical: 5,
  },
  seedIcon: {
    height: 38,
    width: 'auto',
    alignSelf: 'center',
    marginBottom: 8,
  },
  seedText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: vars.COLOR_PRIMARY,
  },
  buttonAction: {
    marginTop: 20,
    maxWidth: 540,
    width: '100%',
    alignSelf: 'center',
  },
});
