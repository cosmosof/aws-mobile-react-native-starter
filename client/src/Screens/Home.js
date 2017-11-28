/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
import React from 'react';
import {
  View,
  ScrollView,
  Text,
  Animated,
  StyleSheet,
  Image,
  Easing,
  TouchableHighlight,
  Modal,
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { DrawerNavigator, NavigationActions, StackNavigator } from 'react-navigation';

import Auth from '../../lib/Categories/Auth';
import Storage from '../../lib/Categories/Storage';
import API from '../../lib/Categories/API';
import AddPet from './AddPet';
import ViewPet from './ViewPet';
import EditProfile from './EditProfile';
import UploadPhoto from '../Components/UploadPhoto';
import SideMenuIcon from '../Components/SideMenuIcon';
import awsmobile from '../../aws-exports';
import { colors } from 'theme';
import { Card, CardSection } from '../Components/Common';
import { calorieCal } from '../Actions/CalFunctions';


let styles = {};

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.handleRetrievePet = this.handleRetrievePet.bind(this);
    this.animate = this.animate.bind(this);
    this.toggleModal = this.toggleModal.bind(this);

    this.animatedIcon = new Animated.Value(0);

    this.state = {
      apiResponse: null,
      loading: true,
      modalVisible: false,
    }
  }

  componentDidMount() {
    this.handleRetrievePet();
    this.animate();
  }

  animate() {
    Animated.loop(
      Animated.timing(
        this.animatedIcon,
        {
          toValue: 1,
          duration: 1300,
          easing: Easing.linear,
        }
      )
    ).start();
  }

  handleRetrievePet() {
    const cloudLogicArray = JSON.parse(awsmobile.aws_cloud_logic_custom);
    const endPoint = cloudLogicArray[0].endpoint;
    const requestParams = {
      method: 'GET',
      url: endPoint + '/items/pets',
    };

    API.restRequest(requestParams).then(apiResponse => {
      this.setState({ apiResponse, loading: false });
    }).catch(e => {
      this.setState({ apiResponse: e.message, loading: false });
    });
  }

  openDrawer = () => {
    this.props.navigation.navigate('DrawerOpen');
  }

  toggleModal() {
    if (!this.state.modalVisible) {
      this.handleRetrievePet();
      this.animate();
    }

    this.setState((state) => ({ modalVisible: !state.modalVisible }));
  }

  renderPet(pet, index) {
    const dob = new Date(pet.dob);
    const years = new Date().getFullYear() - dob.getFullYear();

    let cal = calorieCal(
      pet.gender,
      pet.weight,
      pet.height,
      years,
      pet.activityLevel
    );
    profilePicture = () => {
      const uri = pet.picKey&&pet.picKey !== 'useIcon'? Storage.getObjectUrl(pet.picKey) : null;
      if ( pet.gender === 'male'){
        return (
          <Image
            resizeMode='cover'
            style={styles.petInfoAvatar}
            source={uri ? { uri } : require('../../assets/images/maleProfile.png')}
          />
        );
      } else {
        return (
          <Image
            resizeMode='cover'
            style={styles.petInfoAvatar}
            source={uri ? { uri } : require('../../assets/images/femaleProfile.png')}
          />
        );
      }
    }
    return (
      <Card key={pet.petId}>

      <TouchableHighlight
        onPress={() => {
          this.props.navigation.navigate('ViewPet', { pet })
        }}
        underlayColor='transparent'
      >
        <View style={styles.petInfoContainer}>
          {profilePicture()}
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.petInfoName}>{pet.name}</Text>
            <Text style={styles.calNeeds}>{'Daily Calorie needs : ' + cal}</Text>
          </View>
          <View style={{flex:1, alignItems: 'flex-end', marginRight: 10}}>
          <Image
            style={styles.settingicon}
            source={require('../../assets/images/Switchers.png')}
          />
          </View>

        </View>
      </TouchableHighlight>
      </Card>

    )
  }

  render() {
    const { loading, apiResponse } = this.state;
    const spin = this.animatedIcon.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const AddPetRoutes = StackNavigator({
      AddPet: { screen: AddPet },
      UploadPhoto: { screen: UploadPhoto },
    });

    return (
      <View style={[{ flex: 1 }]}>
        {!loading && <View style={{ position: 'absolute', bottom: 25, right: 25, zIndex: 1 }}>
          <Icon
            onPress={this.toggleModal}
            raised
            reverse
            name='add'
            size={44}
            containerStyle={{ width: 50, height: 50 }}
            color={colors.darkGray}
          />
        </View>}
        <ScrollView style={[{ flex: 1, zIndex: 0 }]} contentContainerStyle={[loading && { justifyContent: 'center', alignItems: 'center' }]}>
          {loading && <Animated.View style={{ transform: [{ rotate: spin }] }}><Icon name='autorenew' color={colors.grayIcon} /></Animated.View>}
          {
            !loading &&
            <View style={styles.titleContainer}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.title}>PROFILES</Text>
                <Text style={styles.titleInfo}>Add yourself and others you care!</Text>
              </View>


              {
                apiResponse.map((pet, index) => this.renderPet(pet, index))
              }
            </View>
          }
        </ScrollView>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={this.toggleModal}
        >
          <AddPetRoutes screenProps={{ handleRetrievePet: this.handleRetrievePet, toggleModal: this.toggleModal }} />
        </Modal>
      </View >
    );
  }
};

styles = StyleSheet.create({
  titleContainer: {
    marginRight: 5,
  },
  titleInfo: {
    marginLeft: 5,
    fontSize: 14,
    color: colors.darkGray,
    flex: 3,
    marginBottom: 28,
    marginTop: 42,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 40,
    marginLeft: 10,
    color: '#2b2f32',
    letterSpacing: 1,
    flex: 2,
  },
  petInfoContainer: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    flexDirection: 'row',

  },
  petInfoName: {
    color: '#2b2f32',
    fontSize: 16,
    marginLeft: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  calNeeds: {
    marginLeft: 17,
  },
  petInfoAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 5,
  },
  settingicon:{
    width: 50,
    height: 50,
  }
})



const HomeRouteStack = {
  Home: {
    screen: (props) => {
      const { screenProps, ...otherProps } = props;
      return <Home {...props.screenProps} {...otherProps} />
    },
    navigationOptions: (props) => {
      return {
        title: 'Home',
        headerLeft: <SideMenuIcon onPress={() => props.screenProps.rootNavigator.navigate('DrawerOpen')} />,
      }
    }
  },
  ViewPet: { screen: ViewPet },
  EditProfile: { screen: EditProfile },
  UploadPhoto: { screen: UploadPhoto },

};

const HomeNav = StackNavigator(HomeRouteStack);

export default (props) => {
  const { screenProps, rootNavigator, ...otherProps } = props;

  return <HomeNav screenProps={{ rootNavigator, ...screenProps, ...otherProps }} />
};
