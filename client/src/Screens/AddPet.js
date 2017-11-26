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
  Text,
  CameraRoll,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  Dimensions,
  Image,
  ScrollView,
  ImageStore,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button as Btn,
  Icon,
  ButtonGroup,
} from 'react-native-elements';
import RNFetchBlob from 'react-native-fetch-blob';
import uuid from 'react-native-uuid';
import mime from 'mime-types';
import { colors } from 'theme';
import Button from 'react-native-button';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Auth from '../../lib/Categories/Auth';
import API from '../../lib/Categories/API';
import Storage from '../../lib/Categories/Storage';
import files from '../Utils/files';
import awsmobile from '../../aws-exports';
import DatePicker from '../Components/DatePicker';
import RadioButtonL from '../Components/RadioButtonL';

const { width, height } = Dimensions.get('window');

let styles = {};

class AddPet extends React.Component {
  static navigationOptions = {
    title: 'Add Profile',
  }

  state = {
    selectedImage: {},
    selectedImageIndex: null,
    images: [],
    selectedGenderIndex: null,
    modalVisible: false,
    types2: [{label: 'Sedentary', value: 0}, {label: 'Lightly Active', value: 1}, {label: '  Active  ', value: 2}, {label: 'Very Active', value: 3},],
    value2: 0,
    value2Index: 0,
    input: {
      name: '',
      dob: null,
      height: '',
      weight: '',
      gender: '',
      activityLevel: 'Sedentary',
    },
    showActivityIndicator: false,
  }

  updateSelectedImage = (selectedImage, selectedImageIndex) => {
    if (selectedImageIndex === this.state.selectedImageIndex) {
      this.setState({
        selectedImageIndex: null,
        selectedImage: {}
      })
    } else {
      this.setState({
        selectedImageIndex,
        selectedImage,
      });
    }
  }

  updateInput = (key, value) => {
    this.setState((state) => ({
      input: {
        ...state.input,
        [key]: value,
      }
    }))
  }

  updateActivity = (index) => {
    let activityLevel = 'Sedentary';
    if (index === 1) {
      activityLevel = 'LightlyActive';
    }
    else if(index === 2) {
      activityLevel = 'Active';
    }
    else if(index === 3) {
      activityLevel = 'VeryActive';
    }
    this.setState((state) => ({
      input: {
        ...state.input,
        activityLevel,
      }
    }))
  }


  getPhotos = () => {
    CameraRoll
      .getPhotos({
        first: 2,
      })
      .then(res => {
        this.setState({ images: res.edges })
        this.props.navigation.navigate('UploadPhoto', { data: this.state, updateSelectedImage: this.updateSelectedImage })
      })
      .catch(err => console.log('error getting photos...:', err))
  }

  toggleModal = () => {
    this.setState(() => ({ modalVisible: !this.state.modalVisible }))
  }

  readImage(imageNode = null) {
    if (imageNode === null) {
      return Promise.resolve();
    }

    const { image } = imageNode;
    const result = {};

    if (Platform.OS === 'ios') {
      result.type = mime.lookup(image.filename);
    } else {
      result.type = imageNode.type;
    }

    const extension = mime.extension(result.type);
    const imagePath = image.uri;
    const picName = `${uuid.v1()}.${extension}`;
    const userId = AWS.config.credentials.data.IdentityId;
    const key = `private/${userId}/${picName}`;

    return files.readFile(imagePath)
      .then(buffer => Storage.putObject(key, buffer, result.type))
      .then(fileInfo => ({ key: fileInfo.key }))
      .then(x => console.log('SAVED', x) || x);
  }

  AddPet = () => {
    const petInfo = this.state.input;
    const { node: imageNode } = this.state.selectedImage;

    this.setState({ showActivityIndicator: true });

    this.readImage(imageNode)
      .then(fileInfo => ({
        ...petInfo,
        picKey: fileInfo && fileInfo.key,
      }))
      .then(this.apiSavePet)
      .then(data => {
        this.setState({ showActivityIndicator: false });
        this.props.screenProps.handleRetrievePet();
        this.props.screenProps.toggleModal();
      })
      .catch(err => {
        console.log('error saving pet...', err);
        this.setState({ showActivityIndicator: false });
      });
  }

  apiSavePet(pet) {
    console.log(JSON.stringify(pet));
    const cloudLogicArray = JSON.parse(awsmobile.aws_cloud_logic_custom);
    const endPoint = cloudLogicArray[0].endpoint;
    const requestParams = {
      method: 'POST',
      url: endPoint + '/items/pets',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(pet),
    }

    return API.restRequest(requestParams);
  }

  updateGender = (index) => {
    let gender = 'female';
    if (index === this.state.selectedGenderIndex) {
      index = null;
      gender = '';
    }
    else if (index === 1) {
      gender = 'male';
    }
    this.setState((state) => ({
      selectedGenderIndex: index,
      input: {
        ...state.input,
        gender,
      }
    }))
  }


  render() {
    const { selectedImageIndex, selectedImage, selectedGenderIndex } = this.state;

    return (

      <View style={{ flex: 1, paddingBottom: 0 }}>
        <ScrollView style={{ flex: 1 }}>
          <Text style={styles.title}>Add New Profile</Text>
          <TouchableWithoutFeedback
            onPress={this.getPhotos}
          >
            {
              selectedImageIndex === null ? (
                <View style={styles.addImageContainer}>
                  <Icon size={34} name='camera-roll' color={colors.grayIcon} />
                  <Text style={styles.addImageTitle}>Upload Photo</Text>
                </View>
              ) : (
                  <Image
                    style={styles.addImageContainer}
                    source={{ uri: selectedImage.node.image.uri }}
                  />
                )
            }

          </TouchableWithoutFeedback>
          <FormLabel>Name</FormLabel>
          <FormInput
            inputStyle={styles.input}
            selectionColor={colors.primary}
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            editable={true}
            placeholder="Please enter a name for the profile"
            returnKeyType="next"
            ref="name"
            textInputRef="nameInput"
            onChangeText={(name) => this.updateInput('name', name)}
            value={this.state.input.name}
          />
          <FormLabel>Date Of Birth</FormLabel>
          <DatePicker
            inputStyle={styles.input}
            selectionColor={colors.primary}
            value={this.state.input.dob}
            ref="datepicker"
            onDateChange={date => this.updateInput('dob', date)}>
          </DatePicker>
          <FormLabel>Height</FormLabel>
          <FormInput
            inputStyle={styles.input}
            selectionColor={colors.primary}
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            editable={true}
            maxLength={4}
            keyboardType="numeric"
            placeholder="Please enter profile's height"
            returnKeyType="next"
            ref="height"
            textInputRef="heightInput"
            onChangeText={(height) => this.updateInput('height', height)}
            value={this.state.input.height}
          />
          <FormLabel>Weight</FormLabel>
          <FormInput
            inputStyle={styles.input}
            selectionColor={colors.primary}
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            editable={true}
            maxLength={4}
            keyboardType="numeric"
            placeholder="Please enter profile's weight"
            returnKeyType="next"
            ref="weight"
            textInputRef="weightInput"
            onChangeText={(weight) => this.updateInput('weight', weight)}
            value={this.state.input.weight}
          />



          <FormLabel>Pick An Activity Level</FormLabel>
          <View style={styles.buttonGroupContainer}>
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

                      onPress={(value, index) => {
                        this.setState({value2:value})
                        this.setState({value2Index: index})
                        this.updateActivity(index);
                      }}
                    />
                  </View>
                )
              })}
            </RadioForm>
            <Text>selected: {this.state.types2[this.state.value2Index].label}</Text>
          </View>
          </View>
          <FormLabel>Gender</FormLabel>
          <View style={styles.buttonGroupContainer}>
            <ButtonGroup
              innerBorderStyle={{ width: 0.5 }}
              underlayColor='#0c95de'
              containerStyle={{ borderColor: '#d0d0d0' }}
              selectedTextStyle={{ color: 'white', fontFamily: 'lato' }}
              selectedBackgroundColor={colors.primary}
              onPress={this.updateGender}
              selectedIndex={this.state.selectedGenderIndex}
              buttons={['female', 'male']}
            />
          </View>
          <Btn
            fontFamily='lato'
            containerViewStyle={{ marginTop: 20 }}
            backgroundColor={colors.primary}
            large
            title="Add Profile"
            onPress={this.AddPet}
          />
          <Text
            onPress={this.props.screenProps.toggleModal}
            style={styles.closeModal}>Dismiss</Text>
        </ScrollView>
        <Modal
          visible={this.state.showActivityIndicator}
          onRequestClose={() => null}
        >
          <ActivityIndicator
            style={styles.activityIndicator}
            size="large"
          />
        </Modal>
      </View>


    );
  }
}

styles = StyleSheet.create({
  buttonGroupContainer: {
    marginHorizontal: 8,
  },
  addImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: colors.lightGray,
    borderColor: colors.mediumGray,
    borderWidth: 1.5,
    marginVertical: 14,
    borderRadius: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageTitle: {
    color: colors.darkGray,
    marginTop: 3,
  },
  closeModal: {
    color: colors.darkGray,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    marginLeft: 20,
    marginTop: 19,
    color: colors.darkGray,
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    fontFamily: 'lato',
  },
  activityIndicator: {
    backgroundColor: colors.mask,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
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

export default AddPet;
