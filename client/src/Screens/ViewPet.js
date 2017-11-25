/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
import React from 'react';
import Slider from 'react-native-slider';
import { View, Text, StyleSheet, Image, ScrollView, Modal, Animated, Easing,
TouchableHighlight, } from 'react-native';
import Communications from 'react-native-communications';
import { colors } from 'theme';
import EditProfile from './EditProfile';
import Storage from '../../lib/Categories/Storage';
import { calorieCal } from '../Actions/CalFunctions';
import { Card, CardSection, Button } from '../Components/Common';
import { Icon } from 'react-native-elements';
import { DrawerNavigator, NavigationActions, StackNavigator } from 'react-navigation';


class ViewPet extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) =>
    console.log(screenProps) || {
      title: `Viewing ${navigation.state.params.pet.name}`
    };

  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);

    this.state = {
      carbDist: 0.45,
      protDist: 0.3,
      fatDist: 0.25,
      textWarning: false,
      modalVisible: false,
    }
  }

  toggleModal() {
    if (!this.state.modalVisible) {
    }
    this.setState((state) => ({ modalVisible: !state.modalVisible }));
  }
  distControl = () => {
    if (
      Math.round(this.state.carbDist * 100) +
        Math.round(this.state.protDist * 100) +
        Math.round(this.state.fatDist * 100) !=
      100
    ) {
      return (
        <Text style={{ color: '#F16B7A', textAlign: 'center' }}>
          Make sure 'Percentage Total is 100'!
        </Text>
      );
    }
    return <Text />;
  };

  updateWarningText = el => {
    if (
      Math.round(this.state.carbDist * 100) +
        Math.round(this.state.protDist * 100) +
        Math.round(this.state.fatDist * 100) !=
      100
    ) {
      return this.setState({ textWarning: el });
    }
    return this.setState({ textWarning: false });
  };

  render() {
    const EditProfileRoutes = StackNavigator({
      EditProfile: { screen: EditProfile },
    });
    const { pet } = this.props.navigation.state.params;
    const dob = new Date(pet.dob);
    const years = new Date().getFullYear() - dob.getFullYear();

    let cal = calorieCal(
      pet.gender,
      pet.weight,
      pet.height,
      years,
      pet.activityLevel
    );

    const uri = pet.picKey ? Storage.getObjectUrl(pet.picKey) : null;

    const birthDay = `${years} years old, ${dob.getMonth() +
      1}/${dob.getDate()}/${dob.getFullYear()}`;

    return (
      <View>
      <ScrollView>
        <Card>
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <View style={{flexDirection: 'column'}}>
                <Image
                  style={styles.image}
                  source={
                    uri ? { uri } : require('../../assets/images/profileicon.png')
                  }
                />
                <Text style={styles.title}>{pet.name}</Text>
                <View style={{flex:1, alignItems: 'center', marginRight: 10}}>
                <Icon
                  name='ios-settings-outline'
                  type='ionicon'
                  color= {colors.darkGray}
                  onPress={() => {
                    console.log("pressed")
                    this.props.navigation.navigate('EditProfile', { pet })
                    }
                  }

                />
                </View>
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.info}>{'Height : ' + pet.height}</Text>
                <Text style={styles.info2}>{'Weight : ' + pet.weight}</Text>
                <Text style={styles.info}>{'DOB : ' + birthDay}</Text>
                <Text style={styles.info2}>{'Gender : ' + pet.gender}</Text>
                <Text style={styles.info}>
                  {'Activity Level : ' + pet.activityLevel}
                </Text>
                <Text style={styles.info2}>{'Calorie needs : ' + cal}</Text>
              </View>
            </View>

          </View>
        </Card>

        <Card>
          <View style={styles.container}>
            <Text>USDA-FDA Recommended Macro Intake Ratios</Text>
            <View
              style={{
                flex: 1,
                alignItems: 'stretch',
                justifyContent: 'center',
                marginTop: 15
              }}
            >
              <Slider
                trackStyle={styles.track}
                thumbStyle={styles.thumb}
                minimumTrackTintColor='#e6a954'
                value={this.state.carbDist}
                onValueChange={carbDist => {
                  this.setState({ carbDist });
                  this.updateWarningText(true);
                }}
              />
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ flex: 2, textAlign: 'left' }}>
                  Carbohydrates
                </Text>
                <Text
                  style={[
                    styles.flex1,
                    this.state.textWarning && styles.textRed
                  ]}
                >
                  {Math.round(this.state.carbDist * 100)} %{' '}
                </Text>
                <Text
                  style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}
                >
                  {Math.round(cal * this.state.carbDist / 4) + ' gram'}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'stretch',
                justifyContent: 'center',
                marginTop: 15
              }}
            >
              <Slider
                trackStyle={styles.track}
                thumbStyle={styles.thumb}
                minimumTrackTintColor= '#D3C4D1'
                value={this.state.protDist}
                onValueChange={protDist => {
                  this.setState({ protDist });
                  this.updateWarningText(true);
                }}
              />
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ flex: 2, textAlign: 'left' }}>Proteins</Text>
                <Text
                  style={[
                    styles.flex1,
                    this.state.textWarning && styles.textRed
                  ]}
                >
                  {Math.round(this.state.protDist * 100)} %{' '}
                </Text>
                <Text
                  style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}
                >
                  {Math.round(cal * this.state.protDist / 4) + ' gram'}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'stretch',
                justifyContent: 'center',
                marginTop: 15
              }}
            >
              <Slider
                trackStyle={styles.track}
                thumbStyle={styles.thumb}
                minimumTrackTintColor= '#A2C3CF'
                value={this.state.fatDist}
                onValueChange={fatDist => {
                  this.setState({ fatDist });
                  this.updateWarningText(true);
                }}
              />
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ flex: 2, textAlign: 'left' }}>Fats</Text>
                <Text
                  style={[
                    styles.flex1,
                    this.state.textWarning && styles.textRed
                  ]}
                >
                  {Math.round(this.state.fatDist * 100)} %{' '}
                </Text>
                <Text
                  style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}
                >
                  {Math.round(cal * this.state.fatDist / 4) + ' gram'}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'stretch',
                justifyContent: 'center',
                marginTop: 15
              }}
            >
              {this.distControl()}
            </View>
          </View>
        </Card>
      </ScrollView>
    
      </View>
    );
  }
}


const imageSize = 100;
const styles = StyleSheet.create({
  track: {
    height: 14,
    borderRadius: 2,
    backgroundColor: 'white',
    borderColor: '#9a9a9a',
    borderWidth: 1,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 2,
    backgroundColor: '#eaeaea',
    borderColor: '#9a9a9a',
    borderWidth: 1,
  },
  infoContainer: {
    paddingLeft: 20,
    justifyContent: 'center',
    flexDirection: 'column',

  },
  breaker: {
    height: 1,
    backgroundColor: colors.darkGray,
    marginVertical: 15,
    width: '100%',
  },
  topContainer: {
    flexDirection: 'row',
  },
  container: {
    padding: 20,
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  },
  title: {
    marginBottom: 20,
    marginTop: 20,
    color: '#2b2f32',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  info: {
    color: colors.darkGray,
    backgroundColor: '#FFFCFC',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
  },
  info2: {
    backgroundColor: '#F7F7F7',
    color: colors.darkGray,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
  },
  flex1: {
    flex: 1,
  },
  textRed: {
    color: '#F16B7A',
  },
});

export default ViewPet;
