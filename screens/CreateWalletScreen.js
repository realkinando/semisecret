import * as Google from 'expo-google-app-auth';
import * as React from 'react';
import { ScrollView, RectButton } from 'react-native-gesture-handler';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';

function createWalletScreen({navigation,phrase}){
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.text}>{phrase}</Text>
          <OptionButton
            icon="md-checkbox"
            label="I Understand"
            onPress={() => navigation.navigate('SignedIn',{},NavigationActions.navigate({routeName:'Home'}))}
          />
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
    text : {
        fontSize : 30
    }
  });

  const mapStateToProps = state => (
    {
      address : state.address,
      phrase : state.phrase
    }
  )

  export default connect(mapStateToProps)(createWalletScreen);