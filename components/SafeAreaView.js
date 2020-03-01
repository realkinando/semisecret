import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Platform, SafeAreaView } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0
  }
});

const SafeAreaViewWrapper = ({ children, style }) => {
  return <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>;
};

SafeAreaViewWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object
};

export default SafeAreaViewWrapper;
