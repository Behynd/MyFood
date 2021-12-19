import React, { Component } from 'react';
import {Text, View, FlatList, Button, TextInputBase, TextInput, UIManager, LayoutAnimation, Platform, Modal, Alert, TouchableOpacity} from 'react-native';
import { GlobalStyle } from '../style';
import { Tables, DB, CreateTable, Insert, Select, Delete, Update} from '../Database/db';
import { validatePathConfig } from '@react-navigation/core';
import { throwStatement } from '@babel/types';
import Feather from 'react-native-vector-icons/Feather';

class Ingredient extends Component {    
    constructor(props) {
        super(props);
        this.db = new DB();
        this.state = {
            Ingredients: [],
            modalVisible: false,
            modalVisibleDelete: false,
            ButtonTitle: "test",
        }
        
        if (Platform.OS == 'android') {
            UIManager.setLayoutAnimationEnabledExperimental && 
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        Select(this.db, Tables.Ingredients).then((values) => {
            
            this.setState({ Ingredients: values});
        });
        this.settings = props.route.params.settings;
        this.state.borderColor = this.settings.FontColor;
        this.state.borderColorName = this.settings.AccentColor;
        this.state.borderColorUnit = this.settings.AccentColor;
        props.navigation.setOptions({ headerStyle: { backgroundColor: this.settings.AccentColor}})
        props.navigation.setOptions({ headerTintColor: this.settings.FontColor })
    }

    componentDidMount() {

    }

    FilterIngredientList(value) {
        if (value.length > 0) {
            Select(this.db, Tables.Ingredients).then((values) => {
                var rtn = [];
                
                values.forEach((ing) => {
                    if (ing.Name.includes(value) || ing.Unit.includes(value)) 
                        rtn.push(ing);
                });
                console.log(rtn)
                this.setState({ Ingredients: rtn});
            })
        }
        else {
            Select(this.db, Tables.Ingredients).then((values) => {
                this.setState({ Ingredients: values})
            })
        }
    }

    SetAnimation() {
        LayoutAnimation.configureNext({
            duration: 250,
            update: {
              type: LayoutAnimation.Types.easeIn,
              springDamping: 0.7,
            },
          });
        LayoutAnimation.configureNext({
            duration: 500,
            create: {
              type: LayoutAnimation.Types.easeIn,
              property: LayoutAnimation.Properties.scaleXY,
              springDamping: 0.7,
            },
        });
    }

    DeleteIngredient(IngredientID) {
        Delete(this.db, Tables.Ingredients, `ID = ${IngredientID}`);
        var List = this.state.Ingredients;
        var removeIndex = List.map(item => item.ID).indexOf(IngredientID);
        List.splice(removeIndex, 1);
        this.SetAnimation();
        this.setState({ Ingredients: List })
    }

    AddOpacity(color , opacity) {
        const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
    }

    AddOrUpdateIngredient() {
        
        if (this.state.Action == 'Update') {
            Select(this.db, Tables.Ingredients, `ID = ${this.state.IngID}`).then((values) => {
                console.log(values)
                var Ingredient = values[0];
                Ingredient.Name = this.state.IngName;
                Ingredient.Unit = this.state.IngUnit;
                Update(this.db, Tables.Ingredients, `Name = '${this.state.IngName}', Unit = '${this.state.IngUnit}'`, `ID = ${Ingredient.ID}`)
                var NewList = this.state.Ingredients;
                var UpdatedIndex = NewList.findIndex((obj => obj.ID == Ingredient.ID));
                NewList[UpdatedIndex] = Ingredient;
                this.setState({ Ingredients: NewList });
                this.setState({ IngID: 0, IngName: "", IngUnit: "", Action: "", ButtonTitle: "" })
            })
        }
        else {
            Insert(this.db, Tables.Ingredients, { Name: this.state.IngName, Unit: this.state.IngUnit}).then((insertID) => {
                this.SetAnimation();
                var NewList = this.state.Ingredients;
                NewList.push({ ID: insertID, Name: this.state.IngName, Unit: this.state.IngUnit });
                this.setState({ Ingredients: NewList})
                this.setState({ IngName: "", IngUnit: "", Action: "", ButtonTitle: "" })
            })
        }
    }

    render() {

        const renderItem = ({ item }) => (
            <View style={[{padding: 5}, {borderBottomColor: this.settings.FontColor}, {borderBottomWidth: 1}]}>
                <View style={[GlobalStyle.ListItem]}>
                    <Text style={[GlobalStyle.ListItemPart, {color: this.settings.FontColor}]}>{item.Name}</Text>
                    <Text style={[GlobalStyle.ListItemPart, {color: this.settings.FontColor}]}>{item.Unit}</Text>
                    <TouchableOpacity onPress={() => { this.setState({ modalVisibleDelete: true, IngID: item.ID }) }}>
                        <Feather name="trash-2" style={[{color: '#ff4d4d'}, {fontSize: 40}]}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[{marginLeft: 10}]} onPress={() => { this.setState({ IngName: item.Name, IngUnit: item.Unit}); this.setState({ modalVisible: true, IngName: item.Name, IngUnit: item.Unit, IngID: item.ID, Action: 'Update', ButtonTitle: "Aktualisieren" }) }}>
                        <Feather name="edit" style={[{color: '#425fff'}, {fontSize: 40}]} />
                    </TouchableOpacity>
                </View>
            </View>
        );
        
        

        return (
            <View style={[{height: '100%'},{backgroundColor: this.settings.MainColor}]}>
                <View style={[{display: 'flex'}, {flexDirection: 'row'}]}>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.modalVisibleDelete}
                    >
                        <View style={[GlobalStyle.Popup, {backgroundColor: this.settings.AccentColor}]}>
                            <Text style={[GlobalStyle.PopText, {color: this.settings.FontColor}]}>Delete this Item?</Text>
                            <View style={GlobalStyle.FlexRow}>
                                <TouchableOpacity onPress={() => { this.setState({ modalVisibleDelete: false, IngID: 0 }) }} style={[{backgroundColor: this.settings.MainColor}, {padding: 5}, {borderColor: this.settings.MainColor}, {borderWidth: 1}, {borderRadius: 10}]}   activeOpacity={0.5}>
                                    <Feather name="chevron-left"  style={[GlobalStyle.ModalButtons, {color: this.settings.FontColor}]} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[{backgroundColor: this.settings.MainColor}, {padding: 5}, {borderColor: this.settings.MainColor}, {borderWidth: 1}, {borderRadius: 10}]} onPress={() => { this.DeleteIngredient(this.state.IngID);  this.setState({ modalVisibleDelete: false })}}  activeOpacity={0.5}>
                                    <Feather name="check" style={[GlobalStyle.ModalButtons, {color: this.settings.FontColor}]}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                       
                        animationType='fade'
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.AddOrUpdateIngredient()
                            this.setState({ modalVisible: false})
                        }}
                    >
                        <View style={[GlobalStyle.Popup, {backgroundColor: this.settings.AccentColor}]}>
                            
                            <TextInput  
                                onFocus={() => { this.setState({ borderColorName: this.settings.MainColor })  }}
                                onBlur={() => { this.setState({ borderColorName: this.settings.MainColor }) }}
                                onEndEditing={() => { this.setState({ borderColorName: this.settings.AccentColor }) }} 
                                style={[GlobalStyle.PropBox, {borderColor: this.state.borderColorName}, {backgroundColor: this.AddOpacity(this.settings.MainColor, 0.5)}, {color: this.settings.FontColor}]} 
                                ref={input => {this.IngName = input}} 
                                value={this.state.IngName} 
                                onChangeText={(name) => this.setState({ IngName: name }) } 
                                placeholder="Name (e.g. Onion)" 
                                placeholderTextColor={this.settings.FontColor} 
                                selectionColor={this.settings.FontColor} />
                                
                            <TextInput  
                                onFocus={() => { this.setState({ borderColorUnit: this.settings.MainColor })  }}
                                onBlur={() => { this.setState({ borderColorUnit: this.settings.MainColor }) }}
                                onEndEditing={() => { this.setState({ borderColorUnit: this.settings.AccentColor }) }} 
                                style={[GlobalStyle.PropBox, {borderColor: this.state.borderColorUnit}, {backgroundColor: this.AddOpacity(this.settings.MainColor, 0.5)}, {color: this.settings.FontColor}]} 
                                ref={input => {this.IngUnit = input}} 
                                value={this.state.IngUnit} 
                                onChangeText={(unit) => this.setState({ IngUnit: unit }) } 
                                placeholder="Einheit (e.g. gramm)" 
                                placeholderTextColor={this.settings.FontColor} 
                                selectionColor={this.settings.FontColor} />
                            <View style={GlobalStyle.FlexRow}>
                                <TouchableOpacity onPress={() => { this.setState({ modalVisible: false }) }} style={[{backgroundColor: this.settings.MainColor}, {padding: 5}, {borderColor: this.settings.MainColor}, {borderWidth: 1}, {borderRadius: 10}]}   activeOpacity={0.5}>
                                    <Feather name="chevron-left"  style={[GlobalStyle.ModalButtons, {color: this.settings.FontColor}]} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[{backgroundColor: this.settings.MainColor}, {padding: 5}, {borderColor: this.settings.MainColor}, {borderWidth: 1}, {borderRadius: 10}]} onPress={() => { this.AddOrUpdateIngredient() }}  activeOpacity={0.5}>
                                    <Feather name="check" style={[GlobalStyle.ModalButtons, {color: this.settings.FontColor}]}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.AddOrUpdateIngredient();  this.setState({ modalVisible: false }) }} style={[{backgroundColor: this.settings.MainColor}, {padding: 5}, {borderColor: this.settings.MainColor}, {borderWidth: 1}, {borderRadius: 10}, {display: this.state.Action == 'Update' ? 'none' : 'flex'}]}   activeOpacity={0.5}>
                                    <Feather name="check-circle"  style={[GlobalStyle.ModalButtons, {color: this.settings.FontColor}]} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <TextInput 
                        style={[GlobalStyle.SearchBox,{backgroundColor: this.AddOpacity(this.settings.AccentColor, 0.5)}, {color: this.settings.FontColor}, {borderColor: this.state.borderColor}]}
                        placeholder="Suche..."
                        placeholderTextColor={this.settings.FontColor}
                        clearButtonMode='always'
                        ref={input => { this.SearchBar = input }}
                        onFocus={() => { this.setState({ borderColor: this.settings.AccentColor })  }}
                        onBlur={() => { this.setState({ borderColor: this.settings.AccentColor }) }}
                        onEndEditing={() => { this.setState({ borderColor: this.settings.FontColor }) }}
                        onChangeText={(value) => { this.FilterIngredientList(value) }}
                    />
                    <TouchableOpacity onPress={() => { this.SearchBar.clear(); this.FilterIngredientList("") }} activeOpacity={0.3} style={{padding: 5}}>
                        <Feather name="x-circle" style={[{fontSize: 45}, {color: this.settings.FontColor}, {textAlignVertical: 'center'}, {margin: 10}]} />
                    </TouchableOpacity>
                </View>
                <FlatList 
                    ref={list => { this.IngredientList = list }}
                    data={this.state.Ingredients}
                    renderItem={renderItem}
                    keyExtractor={item => item.ID}
                    
                />
                <TouchableOpacity onPress={() => { this.setState({ Action: 'Insert', modalVisible: true })}} style={[{backgroundColor: this.settings.AccentColor, display: 'flex', flexDirection: 'row', justifyContent: 'center'}]} activeOpacity={0.3}>
                    <Feather name="plus" style={[{fontSize: 40}]} />
                </TouchableOpacity>
                
            </View>
        )
    }
}

export default Ingredient