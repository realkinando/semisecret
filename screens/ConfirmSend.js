import { Button, Card,Title,Paragraph,Headline,Avatar,DataTable,Divider } from 'react-native-paper';
import React from 'react';
import { View, StyleSheet,Clipboard } from 'react-native';
import recoverWallet from '../walletUtils/recoverWallet';
import { ethers } from 'ethers';
import { StackActions } from 'react-navigation';

class ConfirmSend extends React.Component {
    constructor(props){
        super(props);
        this.sendTx = this.sendTx.bind(this);
    }

    state = {
        txSending : true,
        txSent : true,
        txNotConfirmed : true
    };

    componentDidMount(){
        console.log(this.props);
        console.log(JSON.stringify(this.props.navigation.getParam('value')));
        console.log(this.props.navigation.getParam('toAddress'))
    }

    async sendTx(){
        console.log("Amount being sent " + JSON.stringify(this.props.navigation.getParam('value')));
        let wallet = await recoverWallet("d3689aa60142cfe0002ca5ad2328daed437b65554299d991039004abb485f9a4");
        const provider = new ethers.providers.JsonRpcProvider('https://dai.poa.network');
        console.log("Provider" + provider);
        const network = provider.getNetwork();
        console.log("Network " + network);
        wallet = wallet.connect(provider);
        console.log("wallet connected");
        const fixedAddress = JSON.stringify(this.props.navigation.getParam('toAddress')).replace(/\"/g,"");
        const tx = {
            to : fixedAddress,
            value : ethers.utils.parseEther(JSON.stringify(this.props.navigation.getParam('value'))),
            gasPrice : ethers.utils.parseUnits('4','gwei'),
            gasLimit : 21000
        };
        console.log(tx);
        console.log("sending tx")
        wallet.sendTransaction(tx)
        .then(
            (tx) => {
                console.log(tx);
                this.setState({txSent:true});
                this.setState({txSending:false});
            }
        )
    }

    handleConfirm(){
        this.setState({txNotConfirmed:false});
        this.sendTx();
    }

    render(){
        if (this.state.txNotConfirmed){
            return(
                <View visible = {this.state.txNotConfirmed}>
                <Card>
            <Card.Content>
                <Headline>
                    PLEASE CONFIRM
                </Headline>
                <Paragraph>
                    Press "CONFIRM" to SEND ${JSON.stringify(this.props.navigation.getParam('value'))} to {JSON.stringify(this.props.navigation.getParam('toName'))}
                </Paragraph>
            </Card.Content>
            <Card.Actions>
                <Button onPress={() => this.handleConfirm()} >CONFIRM</Button>
                <Button onPress={()=>this.props.navigation.dispatch(StackActions.pop())}>CANCEL</Button>
            </Card.Actions>
        </Card>
        </View>
            )
        }
        if (this.state.txSending){
            return(
            <View visible = {this.state.txNotConfirmed}>
        <Card visible={this.state.txSending}>
            <Headline>SENDING</Headline>
        </Card>
        </View>)
        }
        if (this.state.txSent){
            return(
        <View>
        <Card visible={this.state.txSent}>
            <Headline>Sent</Headline>
            <Button onPress={()=>this.props.navigation.dispatch(StackActions.pop())}>Go back</Button>
        </Card>
        </View>
        );
            }
    }

}

ConfirmSend.navigationOptions = {
    title : 'Confirm Send',
    tabBarVisible : false
}

export default ConfirmSend;