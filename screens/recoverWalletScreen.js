//fetch wallet
//enter phrase
//if incorrect say error (if there's time for that)
//update redux-state if correct
//update key recoverWallet(key)
//logout
import * as Google from 'expo-google-app-auth';
import * as React from 'react';
import { ScrollView, RectButton } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import * as SecureStore from 'expo-secure-store';


export default function RecoverWalletScreen(){
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        </ScrollView>
      );
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