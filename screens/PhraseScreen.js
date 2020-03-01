import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

class phraseScreen extends React.Component{
    render(){
    return(
        <View>
            <Text style={styles.text}>{this.props.phrase}</Text>
        </View>
    )
}}

styles = StyleSheet.create({
    text : {
        fontSize : 30
    }
})

const mapStateToProps = state => (
    {
      phrase : state.phrase
    }
  )

export default connect(mapStateToProps)(phraseScreen);