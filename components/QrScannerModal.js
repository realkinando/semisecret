import * as React from "react";
import PropTypes from "prop-types";
import { Text, Button,Snackbar } from "react-native-paper";
import { StyleSheet, Modal,View } from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import SafeAreaView from "./SafeAreaView";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  scanner: {
    alignSelf: "stretch",
    flex: 1,
    flexGrow: 1
  }
});

class QrScannerModal extends React.Component {
  
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

  handleBarCodeScanned = ({ type, data }) => {
    console.log(`Scanned type ${type} data: ${data}`);

    const [valid,address] = this.props.addressValidator(data);
    console.log('validated address ' + address);
    if (!valid) {
      this.setState({ scannedText: data });
      this.showNotification();
    }
    else{
      this.setState({ scanned: true });
      this.props.onScanned(address);
    }
  };

  render() {
    const { visible, onClose} = this.props;
    const { hasCameraPermission, scanned, isNotificationVisible, scannedText } = this.state;
    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
        <SafeAreaView style={styles.container}>
          <Text>Scan the address</Text>
          <View style={styles.scanner}>
            <BarCodeScanner onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned} style={styles.scanner} />
            <Snackbar
              visible={isNotificationVisible}
              onDismiss={() => this.hideNotification}
              action={{
              label: "Close",
              onPress: this.hideNotification
            }}
              duration={60000}
          >
          The scanned address ({scannedText}) is not a valid address.
        </Snackbar>
      </View>
          <Button icon="close" onPress={onClose}>
            Close
          </Button>
        </SafeAreaView>
      </Modal>
    );
  }
}

QrScannerModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onScanned: PropTypes.func.isRequired
};

QrScannerModal.defaultProps = {
  visible: false
};

export default QrScannerModal;
