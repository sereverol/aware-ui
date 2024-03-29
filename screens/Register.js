import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
  Alert,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import MainButton from '../components/MainButton';
import RNPickerSelect from 'react-native-picker-select';
import CustomDatePicker from '../components/DatePicker';
import Http from '../services/Http';
import Field from '../components/Fields';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = (props) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    sex: '',
    age: '',
    phoneNumber: '',
    email: '',
    therapistEmail: '',
    password: '',
    confirmPassword: '',
  });
  const [inputNumber, setInputNumber] = useState(1);
  const [loading, setLoading] = useState(false);

  const goForward = () => {
    setInputNumber(inputNumber + 1);
  };

  const goBack = () => {
    setInputNumber(inputNumber - 1);
  };

  let passInput = '';

  let showInput;

  const submitSignUp = async () => {
    // setLoading(true);
    if (
      !Field.checkFields([
        user.firstName,
        user.lastName,
        user.sex,
        user.age,
        user.phoneNumber,
        user.email,
        user.therapistEmail,
        user.password,
        user.confirmPassword,
      ])
    ) {
      Alert.alert('Empty Field', 'Please, fill the fields');
    } else {
      const data = await Http.send('POST', '/api/users/signup', user);

      if (!data) {
        Alert.alert('Fatal Error', 'No data from server...');
      } else {
        switch (data.typeResponse) {
          case 'Success':
            await AsyncStorage.setItem('user', JSON.stringify(data.body[0]));
            props.navigation.replace({
              routeName: 'LoginStack',
              params: {
                data: data.body[0],
              },
            });
            break;

          case 'Fail':
            console.log('error');
            break;

          default:
            Alert.alert(data.typeResponse, data.message);
            break;
        }
      }
    }

    // setLoading(false);
  };

  if (inputNumber === 1) {
    showInput = (
      <View style={styles.inputContainer}>
        <View style={styles.section}>
          <Ionicons name="person" size={20} color="black" />
          <TextInput
            value={user.firstName}
            placeholder="Nombre"
            autoCorrect={false}
            autoCapitalize="words"
            keyboardType={'default'}
            blurOnSubmit={false}
            style={styles.textInput}
            autoFocus
            onChangeText={(firstName) =>
              setUser({ ...user, firstName: firstName })
            }
            // onSubmitEditing={() => passInput.focus()}
          />
        </View>
        <View style={styles.section}>
          <Ionicons name="person" size={20} color="black" />
          <TextInput
            value={user.lastName}
            placeholder="Apellido"
            ref={(input) => (passInput = input)}
            autoCapitalize="words"
            style={styles.textInput}
            onChangeText={(lastName) =>
              setUser({ ...user, lastName: lastName })
            }
            // onSubmitEditing={submitSignIn}
          />
        </View>
        <View style={styles.section}>
          <Ionicons name="male-female" size={20} color="black" />
          <RNPickerSelect
            value={user.sex}
            placeholder={{
              label: 'Indica tu genero...',
              color: 'black',
            }}
            style={{
              inputIOS: { paddingLeft: 10, paddingTop: 3, color: 'black' },
            }}
            onValueChange={(sex) => setUser({ ...user, sex: sex })}
            items={[
              { label: 'Masculino', value: 'masculino' },
              { label: 'Femenino', value: 'femenino' },
              { label: 'Otro', value: 'otro' },
            ]}
          />
        </View>
        <View style={styles.section}>
          <Ionicons name="calendar" size={20} color="black" />

          <CustomDatePicker
            value={user.age}
            onDateChange={(value) => setUser({ ...user, age: value })}
          >
            Fecha de nacimiento
          </CustomDatePicker>
        </View>
        <View style={styles.section}>
          <Ionicons name="mail" size={20} color="black" />
          <TextInput
            value={user.email}
            ref={(input) => (passInput = input)}
            placeholder="Email"
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType={'email-address'}
            style={styles.textInput}
            onChangeText={(email) => setUser({ ...user, email: email })}
            // onSubmitEditing={submitSignIn}
          />
        </View>

        <MainButton onPress={() => goForward()}>Siguiente</MainButton>

        <View style={styles.signUp}>
          <Text style={styles.textSignUp}>Ya tienes cuenta?</Text>
          <TouchableOpacity
            onPress={() => props.navigation.replace('LoginStack')}
          >
            <Text
              style={[styles.textSignUp, { color: '#F8F8FF', marginLeft: 5 }]}
            >
              Inicia Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  if (inputNumber === 2) {
    showInput = (
      <View style={styles.inputContainer}>
        <View style={styles.section}>
          <Ionicons name="phone-portrait-outline" size={20} color="black" />
          <TextInput
            value={user.phoneNumber}
            placeholder="Numero Celular"
            autoCapitalize="none"
            keyboardType={'phone-pad'}
            style={styles.textInput}
            onChangeText={(phoneNumber) =>
              setUser({ ...user, phoneNumber: phoneNumber })
            }
            // onSubmitEditing={submitSignIn}
          />
        </View>
        <View style={styles.section}>
          <Ionicons name="mail" size={20} color="black" />
          <TextInput
            value={user.therapistEmail}
            placeholder="Email del doctor"
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType={'email-address'}
            style={styles.textInput}
            onChangeText={(therapistEmail) =>
              setUser({ ...user, therapistEmail: therapistEmail })
            }
            // onSubmitEditing={submitSignIn}
          />
        </View>
        <View style={styles.section}>
          <Ionicons name="ios-lock-closed" size={20} color="black" />
          <TextInput
            value={user.password}
            ref={(input) => (passInput = input)}
            placeholder="Contraseña"
            autoCapitalize="none"
            style={styles.textInput}
            secureTextEntry
            onChangeText={(password) =>
              setUser({ ...user, password: password })
            }
            // onSubmitEditing={submitSignIn}
          />
        </View>
        <View style={styles.section}>
          <Ionicons name="ios-lock-closed" size={20} color="black" />
          <TextInput
            value={user.confirmPassword}
            ref={(input) => (passInput = input)}
            placeholder="Confirmar contraseña"
            autoCapitalize="none"
            style={styles.textInput}
            secureTextEntry
            onChangeText={(confirmPassword) =>
              setUser({ ...user, confirmPassword: confirmPassword })
            }
            // onSubmitEditing={submitSignIn}
          />
        </View>
        <MainButton
          style={{ backgroundColor: '#7db780' }}
          onPress={() => goBack()}
        >
          Atras
        </MainButton>
        <MainButton onPress={() => submitSignUp()}>Registrate</MainButton>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/aware-bg.png')}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.logosContainer}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.logoContainer}
                source={require('../assets/nobg-awarelogo.png')}
              />
            </View>
            <View style={{ ...styles.awareContainer }}>
              <Image
                style={styles.awareImage}
                source={require('../assets/aware-nobg.png')}
              />
            </View>
          </View>
          {showInput}
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logosContainer: {
    justifyContent: 'flex-start',
    direction: 'rtl',
    flexWrap: 'wrap',

    alignItems: 'center',
    marginVertical: 10,
  },
  inputContainer: {
    padding: 40,
    marginBottom: 30,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
  imageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.70)',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    justifyContent: 'center',
    width: 260,
    height: 100,
    marginVertical: 0,
    overflow: 'hidden',
  },
  logoContainer: {
    width: 230,
    height: 150,
    resizeMode: 'contain',
  },
  awareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    marginBottom: 15,
    width: 280,
    height: 100,
    marginHorizontal: Dimensions.get('window').width / 5.5,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.28,
  },
  awareImage: {
    width: 180,
    height: 150,
    resizeMode: 'contain',
  },
  section: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'rgba(204, 204, 204, 0.78)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  textInput: {
    flex: 1,
    color: 'black',
    paddingLeft: 10,
  },
  signUp: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textSignUp: {
    color: 'black',
    textAlign: 'center',
  },
});

export default Register;
