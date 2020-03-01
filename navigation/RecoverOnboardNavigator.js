import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/SignInScreen';
import CreateWalletScreen from '../screens/CreateWalletScreen';
import RecoverWalletScreen from '../screens/recoverWalletScreen';
import * as React from 'react';

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'SignIn'

export default function RecoverOnboardNavigator({ navigation, route}){
    navigation.setOptions({ headerTitle: getHeaderTitle(route) });
    return(
        <Stack.Navigator screenOptions={{
            headerShown: false
          }} initialRouteName={INITIAL_ROUTE_NAME}>
            <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{title:"Sign In"}}
                />
            <Stack.Screen
                name="CreateWallet"
                component={CreateWalletScreen}
                options={{title:"Create Your Wallet"}}
                />
            <Stack.Screen
                name="RecoverWallet"
                component={RecoverWalletScreen}
                options={{title:"Recover Your Wallet"}}
                />
        </Stack.Navigator>
    )
}

function getHeaderTitle(route) {
    const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
  
    switch (routeName) {
        case "SignIn":
            return "Sign In";
        case "CreateWallet":
            return "Create Your Wallet";
        case "RecoverWallet":
            return "Recover Your Wallet"
    }
}