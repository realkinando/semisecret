import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import { Text, Snackbar, withTheme } from "react-native-paper";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";

const styles = StyleSheet.create({
  scanner: {
    flex: 1
  },
  notification: {
    color: "#FFF"
  }
});

class QrScanner extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
    isNotificationVisible: false,
    scannedText: ""
  };

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  };

  handleBarCodeScanned = ({ type, data }) => {
    console.log(`Scanned type ${type} data: ${data}`);

    let address = extractQrAddress(data);
    if (!address) {
      this.setState({ scannedText: data });
      this.showNotification();
      return;
    }

    this.setState({ scanned: true });
    this.props.onScanned(address);
  };

  showNotification = () => {
    this.setState({
      isNotificationVisible: true
    });
  };

  hideNotification = () => {
    this.setState({
      isNotificationVisible: false
    });
  };

  render() {
    let { hasCameraPermission, scanned, isNotificationVisible, scannedText } = this.state;
    let { style, theme } = this.props;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={style} theme={theme}>
        <BarCodeScanner onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned} style={styles.scanner} />
        <Snackbar
          visible={isNotificationVisible}
          onDismiss={() => this.setState({ isNotificationVisible: false })}
          action={{
            label: "Close",
            onPress: this.hideNotification
          }}
          duration={60000}
          theme={theme}
        >
          The scanned address ({scannedText}) is not a valid address. The address must satisfy the following format:
          ethereum:address. Please scan a valid QR code.
        </Snackbar>
      </View>
    );
  }
}

QrScanner.propTypes = {
  theme: PropTypes.object.isRequired,
  onScanned: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default withTheme(QrScanner);