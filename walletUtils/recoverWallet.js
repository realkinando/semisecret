import * as SecureStore from 'expo-secure-store';
import {ethers} from 'ethers';

export default async function recoverWallet(keyIfNone){
    console.log("KeyIfNone : " + keyIfNone);
    const key = await SecureStore.getItemAsync('PK');
    console.log("Key from secure store"+key);
    if (keyIfNone){
        SecureStore.setItemAsync('PK',keyIfNone);
        return new ethers.Wallet(keyIfNone);
    }
    if (key){
        return new ethers.Wallet(key);
    }
    console.log("Else stage reached")
    const wallet = new ethers.Wallet.createRandom();
    await SecureStore.setItemAsync('PK',wallet.privateKey);
    return wallet;
}