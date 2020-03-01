import * as Google from 'expo-google-app-auth';
import * as React from 'react';
import { ScrollView, RectButton } from 'react-native-gesture-handler';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase';
import '@firebase/firestore'
import {ethers} from 'ethers';
import phraseGenerator from '../walletUtils/phraseGenerator';
import { connect } from 'react-redux';
import * as SecureStore from 'expo-secure-store';

var randomWords = require('random-words');

var firebaseConfig = {
    apiKey: "AIzaSyBXCzgaUR1FEilgrntyU_T0_Op6plY4TUE",
    authDomain: "wordsafe-69541.firebaseapp.com",
    databaseURL: "https://wordsafe-69541.firebaseio.com",
    projectId: "wordsafe-69541",
    storageBucket: "wordsafe-69541.appspot.com",
    messagingSenderId: "948203941135",
    appId: "1:948203941135:web:a94a0bbedb12359c5e227a",
    measurementId: "G-G4JGPQSVZQ"
  };

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const ssc = ({navigation,dispatch}) => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <OptionButton
            icon="md-contact"
            label="Sign In"
            onPress={()=>signInWithGoogleAsync(navigation,dispatch)}
          />
        </ScrollView>
      );
}

async function signInWithGoogleAsync(navigation,dispatch) {
    try {
      const result = await Google.logInAsync({
        androidClientId: "647571849128-mki5it22pa7i8c5lcmq491gm3g7av3gc.apps.googleusercontent.com",
        iosClientId: "647571849128-5rhu6kog4h2hkeljj98crvdchd8j8c8p.apps.googleusercontent.com",
        scopes: ['profile', 'email'],
      });
  
      if (result.type === 'success') {
        console.log(result.idToken)
        onSignIn(result,navigation,dispatch);
        return result;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

function onSignIn(googleUser,navigation,dispatch) {
    console.log('Google Auth Response', googleUser);
    const gUser = googleUser;
    const docRef = db.collection("users").doc(gUser.user.id);
    docRef.get().then(function(doc){
        if (doc.exists) {
            const encryptedWallet = JSON.parse(doc.data()[walletObj]);
            navigation.navigate("RecoverWalletScreen");
        } 
        else {
                    const phrase = randomWords(12).join(' ');
                    const wallet = ethers.Wallet.createRandom();
                    const walletKey = wallet.privateKey;
                    const walletAddress = wallet.address;
                    SecureStore.setItemAsync('PK',walletKey);
                    const encryptedWallet = wallet.encrypt(phrase);
                    db.collection("users").doc(gUser.user.id).set({
                        userId : gUser.user.id,
                        walletObj : JSON.stringify(encryptedWallet)
                    });
                    dispatch({
                        type : 'setAddress',
                        value : walletAddress
                    });
                    dispatch({
                        type : 'setPhrase',
                        value : phrase
                    });
                    navigation.navigate("CreateWallet");
                }}).catch(function(error) {
                    console.log("Error getting document:", error);
                });
}

  
function OptionButton({ icon, label, onPress, isLastOption }) {
    return (
      <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.optionIconContainer}>
            <Ionicons name={icon} size={44} color="rgba(230,0,100,0.7)" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionText}>{label}</Text>
          </View>
        </View>
      </RectButton>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    contentContainer: {
      paddingTop: 15,
    },
    optionIconContainer: {
      marginRight: 12,
    },
    option: {
      backgroundColor: '#ffff00',
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: 10,
      borderColor: '#ff0000',
    },
    lastOption: {
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    optionText: {
      fontSize: 30,
      alignSelf: 'flex-start',
      marginTop: 1,
    },
  });

  const mapStateToProps = state => (
    {
      address : state.address,
      phrase : state.phrase
    }
  )

  export default connect(mapStateToProps)(ssc);