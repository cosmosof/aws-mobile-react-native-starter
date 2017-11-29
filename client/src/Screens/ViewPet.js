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
TouchableHighlight, TouchableWithoutFeedback, } from 'react-native';
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
      title: navigation.state.params.pet.name
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
  distControl1 = () => {
    if (
      Math.round(this.state.carbDist * 100) +
        Math.round(this.state.protDist * 100) +
        Math.round(this.state.fatDist * 100) !=
      100
    ) {
      return (
        <Text style={styles.distControl1}>
          Make sure this
        </Text>
      );
    }
    return <Text />;
  };
  distControl2 = () => {
    if (
      Math.round(this.state.carbDist * 100) +
        Math.round(this.state.protDist * 100) +
        Math.round(this.state.fatDist * 100) !=
      100
    ) {
      return (
        <Text style={styles.distControl2}>
          add up to 100 %
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
  profilePicture = () => {
    const { pet } = this.props.navigation.state.params;
    const uri = pet.picKey&&pet.picKey !== 'useIcon'? Storage.getObjectUrl(pet.picKey) : null;
    if ( pet.gender === 'male'){
      return (
        <Image
          style={styles.image}
          source={
            uri ? { uri } : require('../../assets/images/maleProfile.png')
          }
        />
      );
    } else {
      return (
        <Image
          style={styles.image}
          source={
            uri ? { uri } : require('../../assets/images/femaleProfile.png')
          }
        />
      );
    }
  }
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

    const DOB = `${dob.getMonth() +
      1}/${dob.getDate()}/${dob.getFullYear()}`;
    const birthDay = `${years} years old, ${dob.getMonth() +
      1}/${dob.getDate()}/${dob.getFullYear()}`;

    return (
      <View>
      <ScrollView>
        <Card>
          <View style={styles.topContainer}>
            <View style={styles.leftTopContainer}>
              {this.profilePicture()}
              <Text style={styles.title}>{pet.name}</Text>
              <View style={{flex:1, alignItems: 'center', marginRight: 10}}>
                <TouchableWithoutFeedback onPress={() => {
                      this.props.navigation.navigate('EditProfile', { pet })
                    }
                  }
                >
                  <Image
                    style={styles.settingicon}
                    source={require('../../assets/images/Switchers.png')}
                    />
                </TouchableWithoutFeedback>
              </View>
            </View>
            <View style={styles.rightTopContainer}>
            <View style={styles.medColorList}>
              <View style={{flex:3}}>
                <Text style={styles.infoTitle}>{'Height'}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={styles.infoTitle}>{':'}</Text>
              </View>
              <View style={{flex:4}}>
                <Text style={styles.info}>{pet.height}</Text>
              </View>
            </View>
            <View style={styles.lightColorList}>
              <View style={{flex:3}}>
                <Text style={styles.infoTitle}>{'Weight'}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={styles.infoTitle}>{':'}</Text>
              </View>
              <View style={{flex:4}}>
                <Text style={styles.info}>{pet.weight}</Text>
              </View>
            </View>
            <View style={styles.medColorList}>
              <View style={{flex:3}}>
                <Text style={styles.infoTitle}>{'DOB'}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={styles.infoTitle}>{':'}</Text>
              </View>
              <View style={{flex:4}}>
                <Text style={styles.info}>{DOB}</Text>
              </View>
            </View>
            <View style={styles.lightColorList}>
              <View style={{flex:3}}>
                <Text style={styles.infoTitle}>{'Gender'}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={styles.infoTitle}>{':'}</Text>
              </View>
              <View style={{flex:4}}>
                <Text style={styles.info}>{pet.gender}</Text>
              </View>
            </View>
            <View style={styles.medColorList}>
              <View style={{flex:3}}>
                <Text style={styles.infoTitle}>{'Activity Level'}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={styles.infoTitle}>{':'}</Text>
              </View>
              <View style={{flex:4}}>
                <Text style={styles.info}>{pet.activityLevel}</Text>
              </View>
            </View>
            <View style={styles.lightColorList}>
              <View style={{flex:3}}>
                <Text style={styles.infoTitle}>{'Calorie needs'}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={styles.infoTitle}>{':'}</Text>
              </View>
              <View style={{flex:4}}>
                <Text style={styles.info}>{cal}</Text>
              </View>
            </View>
            </View>
          </View>
        </Card>
        <Card>
          <View style={styles.container}>
           <View style={{flex: 1, flexDirection: 'column', alignSelf: 'center', maxWidth: 360}}>
            <Text>USDA-FDA Recommended Macro Intake Ratios</Text>
            <View
              style={{
                flex: 1,
                alignItems: 'stretch',
                justifyContent: 'center',
                marginTop: 15,
              }}
            >

            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
              <View>
                {this.distControl1()}
              </View>
              <View >
                <Text style={this.state.textWarning && styles.textRed}>{Math.round(this.state.carbDist*100) + Math.round(this.state.protDist*100) + Math.round(this.state.fatDist*100)} %
                </Text>
              </View>
              <View>
                {this.distControl2()}
              </View>
            </View>

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
                    styles.flex2,
                    this.state.textWarning && styles.textRed
                  ]}
                >
                  {Math.round(this.state.carbDist * 100)} %{' '}
                </Text>
                <Text
                  style={{ flex: 2, textAlign: 'right', fontWeight: 'bold' }}
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
                    styles.flex2,
                    this.state.textWarning && styles.textRed
                  ]}
                >
                  {Math.round(this.state.protDist * 100)} %{' '}
                </Text>
                <Text
                  style={{ flex: 2, textAlign: 'right', fontWeight: 'bold' }}
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
                    styles.flex2,
                    this.state.textWarning && styles.textRed
                  ]}
                >
                  {Math.round(this.state.fatDist * 100)} %{' '}
                </Text>
                <Text
                  style={{ flex: 2, textAlign: 'right', fontWeight: 'bold' }}
                >
                  {Math.round(cal * this.state.fatDist / 4) + ' gram'}
                </Text>
              </View>
            </View>

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
  distControl1: {
    color: '#F16B7A',
    textAlign: 'right',
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 5,
    marginTop: 3
  },
  distControl2: {
    color: '#F16B7A',
    textAlign: 'left',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 5,
    marginTop: 3
  },
  medColorList: {
    flexDirection: 'row',
    backgroundColor: '#F9F7EF',
    flex: 1,
    maxWidth: 180,
    alignItems: 'center',
  },
  lightColorList: {
    flexDirection: 'row',
    backgroundColor: '#FFFCFC',
    flex: 1,
    maxWidth: 180,
    alignItems: 'center',
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    maxWidth: 360,
    marginTop: 20,
    marginBottom: 20,
  },
  rightTopContainer: {
    flex:0.5,
    alignItems:'center',
    marginRight: 10,
  },
  leftTopContainer: {
    flex:0.5,
    alignItems:'center',
    marginLeft: 10,
  },
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
  rightContainer: {
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
  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    padding: 20,
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    borderWidth: 1,
    borderColor: '#ddd',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
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
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 12,
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: 12,
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
  flex2: {
    flex: 2,
    textAlign: 'center',
  },
  flex1: {
    flex: 1,
  },
  textRed: {
    color: '#F16B7A',
  },
  settingicon: {
    width: 50,
    height: 50,
  },
});

export default ViewPet;
