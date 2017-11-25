import React, { Component } from 'react';
import { colors } from 'theme';

import {
  StyleSheet,
  ScrollView,
  Text,
  View
} from 'react-native';

import Button from 'react-native-button';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

class RadioButtonL extends Component {
  constructor () {
    super()
    this.state = {
      types2: [{label: 'Sedentary', value: 0}, {label: 'Lightly Active', value: 1}, {label: '  Active  ', value: 2}, {label: 'Very Active', value: 3},],
      value2: 0,
      value2Index: 0,
    }
  }
  render () {
    return (
      <View style={styles.container}>
        <ScrollView>

          <View style={styles.component}>
            <RadioForm
              formHorizontal={true}
              animation={true}

            >

              {this.state.types2.map((obj, i) => {
                var that = this;
                var is_selected = this.state.value2Index == i;
                return (
                  <View key={i} style={styles.radioButtonWrap}>
                    <RadioButton
                      isSelected={is_selected}
                      obj={obj}
                      index={i}
                      labelHorizontal={false}
                      buttonColor={'#6F7C8A'}
                      labelColor={'#6F7C8A'}
                      style={[i !== this.state.types2.length-1 && styles.radioStyle]}

                    />
                  </View>
                )
              })}
            </RadioForm>
            <Text>selected: {this.state.types2[this.state.value2Index].label}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  component: {
    alignItems: 'center',
    marginBottom: 20,
  },
  radioStyle: {
    borderRightWidth: 1,
    borderColor: '#6F7C8A',
    paddingRight: 10
  },
  radioButtonWrap: {
    marginRight: 5,
    paddingBottom: 10
  },
});

export default RadioButtonL;
