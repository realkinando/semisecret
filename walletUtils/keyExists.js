import * as SecureStore from 'expo-secure-store';
import {ethers} from 'ethers';

export default async function keyExists(){
    const key = await SecureStore.getItemAsync('PK');
    if(key){
        try{
            new ethers.Wallet(key);
            return true;
        }
        catch(err){
            return false;
        }
    }
    return false;
}