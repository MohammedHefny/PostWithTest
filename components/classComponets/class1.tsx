// Class1.tsx
import {StyleSheet, Text, View, Button} from 'react-native';
import React, {Component} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type Class1Props = NativeStackScreenProps<RootStackParamList, 'Class1'>;

type CounterState = {
  count: number;
};

class Class1 extends Component<Class1Props, CounterState> {
  state = {
    count: 0,
  };

  onIncrement = () => {
    this.setState(prevState => ({count: prevState.count + 1}));
  };

  render(): React.ReactNode {
    const {message} = this.props.route.params; // Access `message` from route params
    return (
      <View>
        <Button onPress={this.onIncrement} title="Increment" color="#841584" />
        <Text>
          {message} {this.state.count}
        </Text>
      </View>
    );
  }
}

export default Class1;

const styles = StyleSheet.create({});
