import React from 'react';
import { View, StyleSheet,Clipboard } from 'react-native';
import { Button, Chip, Card,Title,Paragraph,Headline,Avatar,DataTable,Divider,TextInput,Snackbar} from 'react-native-paper';
import { connect } from 'react-redux';
import QrScannerModal from "../components/QrScannerModal";
import recoverWallet from '../walletUtils/recoverWallet';
import {ethers} from 'ethers';

class SendScreen extends React.Component {

  constructor(props){
    super(props);
    this.baseState = this.state;
    this.validateAddress = this.validateAddress.bind(this);
    this.getAddressFromClipboard = this.getAddressFromClipboard.bind(this);
    this.handleQrScan = this.handleQrScan.bind(this);
  }

  state = {
    amountError : false,
    txInvalid : true,
    amount : '0',
    scannerVisible : false,
    isNotificationVisible: false,
    notificationText: "",
    toAddress : ""
  };

  validateAddress(address){
    const formattedAddress = address.replace(/ethereum:/i,"");
    console.log("formatted address" + formattedAddress);
    if (/(0x)([\d[a-f]){40}/i.test(formattedAddress)){
        console.log(true);
        return ([true,formattedAddress])
    }
      
    else{
      console.log(false);
      return ([false,""])
    }
  };

  showNotification = (notificationText, timeout = 4000) => {
    this.setState({
      isNotificationVisible: true,
      notificationText
    });

    if (timeout) {
      this.hideNotification(timeout);
    }
  };

  hideNotification = (timeout = 1) => {
    setTimeout(() => {
      this.setState({
        isNotificationVisible: false,
        notificationText: ""
      });
    }, timeout);
  };

  showQrScanner = () => {
    this.setState({
      scannerVisible: true
    });
  };

  hideQrScanner = () => {
    this.setState({
      scannerVisible: false
    });
  };

  handleQrScan = address => {
    console.log("address in handleQR"+address)
    this.hideQrScanner();
    this.setState({toAddress:address});
    this.setState({toName:address});
    if (!this.state.amountError)
      this.setState({txInvalid:false})
    console.log("toAddress : " + this.state.toAddress)
  };


  validateAmount({text}){
    this.setState({amountError:false})
    this.setState({amount:text.toString()});
  };

  navigateToConfirmation(){
    const {amount,toAddress,toName} = this.state;
    this.setState(this.baseState);
    this.props.navigation.navigate("ConfirmSend",{value:parseFloat(amount),toAddress:toAddress,toName:toName})
  }

  async sendTx(){
    const {toAddress} = this.state;
    const amount = parseFloat(this.state.amount);
    let wallet = await recoverWallet("d3689aa60142cfe0002ca5ad2328daed437b65554299d991039004abb485f9a4");
    const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/bc365e6e93c741e8bcc7b920134d29a3');
    console.log("Provider" + provider);
    const network = provider.getNetwork();
    console.log("Network " + network);
    wallet = wallet.connect(provider);
    console.log("wallet connected");
    console.log(toAddress);
    const fixedAddress = JSON.stringify(toAddress).replace(/\"/g,"");
    const tx = {
        to : fixedAddress,
        value : ethers.utils.parseEther(JSON.stringify(amount)),
        gasPrice : ethers.utils.parseUnits('4','gwei'),
        gasLimit : 21000
    };
    console.log(tx);
    console.log("sending tx");
    this.setState(this.baseState);
    wallet.sendTransaction(tx)
    .then(
        (tx) => {
            console.log(tx);
            this.setState({txSent:true});
            this.setState({txSending:false});
        }
    )
}

  async getAddressFromClipboard (){
    const address = await Clipboard.getString();
    const [valid,formattedAddress] = this.validateAddress(address);
    if (valid){
      this.setState({toAddress:address});
      this.setState({toName:address});
      console.log(this.state.amountError)
      if (!this.state.amountError)
        this.setState({txInvalid:false})
    }
    else{
      this.setState({toAddress:""});
      this.setState({toAddressValid:false});
      this.setState({toName:""});
      this.showNotification("Address Invalid");
    }

  };

  render () {
  return (
    <View style={styles.container}>
      <QrScannerModal visible={this.state.scannerVisible} onClose={this.hideQrScanner} onScanned={this.handleQrScan} addressValidator={this.validateAddress} />
      <Card>
        <Card.Content>
          <Headline> Send Ξ (Rinkeby) </Headline>
          <TextInput label="Amount" value={this.state.amount} keyboardType='number-pad' error={this.state.amountError} onChangeText={text => this.validateAmount({text})}/>
          <Headline> To : {this.state.toName} </Headline>
          <Paragraph>{this.state.toAddress}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Chip icon="camera" onPress={this.showQrScanner}> Scan QR Code </Chip>
          <Chip onPress={this.getAddressFromClipboard}>Paste Address</Chip>
        </Card.Actions>
      </Card>
      <Button mode='contained'
      disabled = {this.state.txInvalid}
      onPress={() => this.sendTx()}>
        Send</Button>
      <Snackbar
          visible={this.state.isNotificationVisible}
          onDismiss={() => this.setState({ isNotificationVisible: false })}
          action={{
            label: "Close",
            onPress: this.hideNotification
          }}
          >
          {this.state.notificationText}
    </Snackbar>
    </View>
  );
}
}


SendScreen.navigationOptions = {
  title: 'Send Money',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});

export default SendScreen;