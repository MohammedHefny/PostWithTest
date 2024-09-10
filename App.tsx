// App.tsx
import {StyleSheet, Text, View} from 'react-native';
import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './components/Home';
import Details from './components/Details';
import Posts from './components/Posts';
import Class1 from './components/classComponets/class1';
const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Home: undefined;
  Details: {post: Story};
  Posts: undefined;
  Class1: {message: string};
};

interface Story {
  objectID: string;
  title: string;
  author: string;
  url: string;
  created_at: string;
  _tags: string[];
}

class App extends Component {
  render(): React.ReactNode {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Posts">
          <Stack.Screen name="Posts" component={Posts} />
          <Stack.Screen
            name="Class1"
            component={Class1}
            initialParams={{message: 'The Counter is'}}
          />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Details" component={Details} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
