import React, { Component } from 'react';
import {Text, View, FlatList, Button, TextInputBase, TextInput, UIManager, LayoutAnimation, Platform, Modal, Alert, TouchableOpacity} from 'react-native';
import { GlobalStyle } from '../style';
import { Tables, DB, CreateTable, Insert, Select, Delete, Update} from '../Database/db';
import { validatePathConfig } from '@react-navigation/core';
import { mixedTypeAnnotation, thisTypeAnnotation, throwStatement, tsImportEqualsDeclaration } from '@babel/types';
import Feather from 'react-native-vector-icons/Feather';
import Ingredient from './Ingredient';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useEffect, useState } from 'react/cjs/react.development';
import SelectDropdown from 'react-native-select-dropdown';

 

class Info extends Component {
    constructor(props) {
        super(props);
        this.db = new DB();
        const settings = props.settings;
        this.OnRecipeSave = props.OnRecipeSave;
        this.Callback = props.Callback;
        this.state = {
            MainColor: settings.MainColor,
            AccentColor: settings.AccentColor,
            FontColor: settings.FontColor,
            Language: settings.Language,
            RecipeInfo: props.Info
        }
        
    }
    
    Update() {
        this.Callback(this.state.RecipeInfo);
    }

    AddOpacity(color , opacity) {
        const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
    }
    render() {
        return (
            <View style={[GlobalStyle.RecipeInfo, {backgroundColor: this.state.MainColor}]}>
                <TextInput placeholderTextColor={this.state.FontColor} style={[GlobalStyle.RecipeInfoNameInput, {color: this.state.FontColor, borderColor: this.state.FontColor, backgroundColor: this.AddOpacity(this.state.AccentColor, 0.5)}]} onChangeText={async(text) => { await this.setState({ RecipeInfo: { ID: this.state.RecipeInfo.ID, Name: text, PrepTime: this.state.RecipeInfo.PrepTime}}); this.Update();}} placeholder="Name">{this.state.RecipeInfo.Name}</TextInput>
                <TextInput placeholderTextColor={this.state.FontColor} style={[GlobalStyle.RecipeInfoTimeInput, {color: this.state.FontColor, borderColor: this.state.FontColor, backgroundColor: this.AddOpacity(this.state.AccentColor, 0.5)}]} keyboardType='numeric' onChangeText={async(numb) => { await this.setState({ RecipeInfo: { ID: this.state.RecipeInfo.ID, PrepTime: parseInt(numb, 10), Name: this.state.RecipeInfo.Name }}); this.Update();}} placeholder="Zeit">{this.state.RecipeInfo.PrepTime}</TextInput>
                <TouchableOpacity onPress={() => { this.OnRecipeSave(); }} style={[GlobalStyle.BtnSave, {backgroundColor: this.state.AccentColor, display: 'flex', flexDirection: 'row', justifyContent: 'center'}]} activeOpacity={0.3}>
                    <Feather name="save" style={[{fontSize: 40}]} />
                </TouchableOpacity>
            </View>
        )
    }
}

 class Ings extends Component {
    constructor(props) {
        super(props);
        this.db = new DB();
        const settings = props.settings;
        this.state = {
            MainColor: settings.MainColor,
            AccentColor: settings.AccentColor,
            FontColor: settings.FontColor,
            Language: settings.Language,
            Ings: props.Ings,
            IngDS: [],
            action: props.action
        }
        Select(this.db, Tables.Ingredients).then((values) => {
            this.setState({ IngDS: values })
        });
        
        
    }

    Update() {
        this.props.Callback(this.state.Ings);
    }

    AddOpacity(color , opacity) {
        const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
    }

    render() {

        const renderIngs = ({ item }) => (
            <View style={[GlobalStyle.IngListItem, {backgroundColor: this.state.MainColor, padding: 5}]}>
                <SelectDropdown
                    
                    data={this.state.IngDS}
                    buttonStyle={[GlobalStyle.IngPicker, {backgroundColor: this.state.MainColor}, {borderColor: this.state.FontColor}]}
                    buttonTextStyle={[{color: this.state.FontColor}]}
                    rowStyle={[GlobalStyle.PickerItem, {backgroundColor: this.state.MainColor}, {borderColor: this.state.FontColor}]}
                    rowTextStyle={[{color: this.state.FontColor}]}
                    
                    defaultButtonText={this.state.action == 'add' ? "Zutat auswählen..." : item.IngredientName }
                    onSelect={async(selectedItem, index) => {
                        item.IngredientID = selectedItem.ID;
                        item.Unit = this.state.IngDS.find(c => c.ID == selectedItem.ID).Unit;
                        await this.setState({ refresh: !this.state.refresh});
                        this.Update();
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem.Name
                    }}
                    rowTextForSelection={(item, index) => {
                        return item.Name
                    }}
                />
                <TextInput value={item.Amount.toString()} style={[GlobalStyle.IngAmountInput, {color: this.state.FontColor, backgroundColor: this.AddOpacity(this.state.AccentColor, 0.5), borderColor: this.state.FontColor}]} keyboardType='numeric' onChangeText={async(numb) => { item.Amount = numb; var Ing = this.state.Ings.map(item => item.ID).indexOf(item.ID); var NewIngs = this.state.Ings; NewIngs[Ing].Amount = numb; await this.setState({Ings: NewIngs}); this.Update(); }} />
                <Text style={[GlobalStyle.UnitLabel, { color: this.state.FontColor}]}>{ item.Unit }</Text>
                <TouchableOpacity style={GlobalStyle.IngDeleteButton} onPress={() => { var removeIndex = this.state.Ings.map(item => item.ID).indexOf(item.ID); 
                                                    var newIngs = this.state.Ings; newIngs.splice(removeIndex, 1); this.setState({ Ings: newIngs }); this.Update(); }}>
                    <Feather name="trash-2" style={[{color: '#ff4d4d'}, {fontSize: 40}]}/>
                </TouchableOpacity>
            </View>
        )

        return (
            <View style={[{height: '100%'}]}>
                <FlatList 
                    ref={list => { this.IngList = list }}
                    data={this.state.Ings}
                    renderItem={renderIngs}
                    keyExtractor={item => item.ID}
                    extraData={this.state.refresh}
                    style={[{backgroundColor: this.state.MainColor}]}
                />
                <TouchableOpacity onPress={() => { var NewIng = this.state.Ings;   NewIng.push({ ID: NewIng.length == 0 ? 0 : ((Math.max.apply(Math, NewIng.map(function(o) { return o.ID; }))) + 1), Name: '', Unit: '', Amount: 0, IngredientID: 0 }); this.setState({ Ings: NewIng}); this.Update(); }} style={[{backgroundColor: this.state.AccentColor, display: 'flex', flexDirection: 'row', justifyContent: 'center'}]} activeOpacity={0.3}>
                    <Feather name="plus" style={[{fontSize: 40}]} />
                </TouchableOpacity>
            </View>
        )
    }
    
}

class Steps extends Component {
    constructor(props){
        super(props)
        this.db = new DB();
        const settings = props.settings;
        this.state = {
            MainColor: settings.MainColor,
            AccentColor: settings.AccentColor,
            FontColor: settings.FontColor,
            Language: settings.Language,
            Steps: props.Steps,
        }
        
    }

    Update() {
        this.props.Callback(this.state.Steps);
    }

    AddOpacity(color , opacity) {
        const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
    }

    render() {
        const renderWorkstep = ({ item }) => (
            <View style={[GlobalStyle.IngListItem, { backgroundColor: this.state.MainColor, padding: 5 }]}>
                <TextInput value={item.Text} placeholderTextColor={this.state.FontColor} placeholder="Arbeitsschritt" multiline={true} style={[GlobalStyle.StepTextInput, {borderColor: this.state.FontColor, color: this.state.FontColor, paddingLeft: 15}]} onChangeText={async(text) => { item.Text = text; var Step = this.state.Steps.map(item => item.ID).indexOf(item.ID); var NewSteps = this.state.Steps; NewSteps[Step].Text = text; await this.setState({ Steps: NewSteps}); this.Update(); }} />
                <TextInput value={item.StepTime.toString()} placeholderTextColor={this.state.FontColor} placeholder="Zeit" keyboardType='numeric' style={[GlobalStyle.StepAmountInput, {borderColor: this.state.FontColor, color: this.state.FontColor, paddingLeft: 15}]} onChangeText={async(numb) => { item.Amount = numb; var Step = this.state.Steps.map(item => item.ID).indexOf(item.ID); var NewSteps = this.state.Steps; NewSteps[Step].StepTime = numb; await this.setState({ Steps: NewSteps}); this.Update(); }} /> 
                <TouchableOpacity style={[GlobalStyle.StepDelete]} onPress={async() => { var removeIndex = this.state.Steps.map(item => item.ID).indexOf(item.ID);
                                                    var newSteps = this.state.Steps; newSteps.splice(removeIndex, 1); await this.setState({ Steps: newSteps}); this.Update(); }}>
                    <Feather name="trash-2" style={[{color: '#ff4d4d'}, {fontSize: 40}]}/>
                </TouchableOpacity>
            </View>
        )
        return (
            <View style={[{height: '100%'}]}>
                <FlatList 
                    data={this.state.Steps}
                    renderItem={renderWorkstep}
                    keyExtractor={item => item.ID}
                    style={[{backgroundColor: this.state.MainColor}]}
                />  
                <TouchableOpacity onPress={async() => {  var NewStep = this.state.Steps; NewStep.push({ ID: NewStep.length == 0 ? 0 : ((Math.max.apply(Math, NewStep.map(function(o) { return o.ID; }))) + 1), Text: '', StepTime: 0}); await this.setState({ Steps: NewStep}); this.Update(); }} style={[{backgroundColor: this.state.AccentColor, display: 'flex', flexDirection: 'row', justifyContent: 'center'}]} activeOpacity={0.3}>
                    <Feather name="plus" style={[{fontSize: 40}]} />
                </TouchableOpacity>  
            </View>
        )
    }
}

function RecipeTabBar({ state, descriptors, navigation, settings }) {
    return (
        <View style={{ flexDirection: 'row',backgroundColor: settings.AccentColor,height:50,justifyContent:"center",alignItems:"center" }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                    ? options.title
                    : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                });

                if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                }
                };

                const onLongPress = () => {
                navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                });
                };

                return (
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityStates={isFocused ? ['selected'] : []}
                    accessibilityLabel={options.tabBarAccessibilityLabel}
                    key={label}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    style={{ flex: 1, alignItems:"center" }}
                >
                    <Text style={{ color: isFocused ? settings.FontColor : settings.MainColor, fontSize: 18 }}>
                    {label}
                    </Text>
                </TouchableOpacity>
                );
            })}

        </View>
    )
}




export class RecipeTabs extends Component {
    constructor(props){
        super(props)
     
        this.db = new DB();
        const settings = props.route.params.settings;
        
        this.state = {
            settings: settings,
            Recipe: props.route.params.Recipe,
            action: props.route.params.action
            
        }

        props.navigation.setOptions({ headerStyle: { backgroundColor: this.state.settings.AccentColor }, headerTintColor: this.state.settings.FontColor })
    }

    OnRecipeSave = () =>  {
       
        if (this.state.action == 'add'){
            
            Insert(this.db, Tables.Recipe, { Name: this.state.Recipe.Info.Name, PrepTime: this.state.Recipe.Info.PrepTime }).then((InsertID) => {
                
                this.state.Recipe.Ing.forEach((Ingredient) => {
                    Insert(this.db, Tables.RecipeIngredients, { RecipeID: InsertID, IngredientID: Ingredient.IngredientID, Amount: Ingredient.Amount });
                });
                this.state.Recipe.Step.forEach((Workstep) => {  
                    Insert(this.db, Tables.RecipeWorksteps, { RecipeID: InsertID, Text: Workstep.Text, StepTime: Workstep.StepTime, OrderNumber: Workstep.ID });
                });
            }).then(() => {
                
                this.props.navigation.navigate("Recipe", { Recipes: this.state.Recipe});
            });   
        }
        else {
            
            var RecipeDB = { Info: {}, Ings: [], Steps: [] };
            var Recipe = this.state.Recipe;
            
            
            
            Select(this.db, Tables.Recipe, `ID = ${Recipe.Info.ID}`).then((Reciper) => {
                
                RecipeDB.Info.ID = Reciper[0].ID;
                RecipeDB.Info.Name = Reciper[0].Name;
                RecipeDB.Info.PrepTime = Reciper[0].PrepTime;
                
                Select(this.db, Tables.RecipeIngredients, `RecipeID = ${Reciper[0].ID}`).then((RecipeIngredients) => {
                    RecipeDB.Ings = RecipeIngredients;
                }).then(() => {
                    Select(this.db, Tables.RecipeWorksteps, `RecipeID = ${Reciper[0].ID}`).then((RecipeWorksteps) => {
                        RecipeDB.Steps = RecipeWorksteps;
                    }).then(() => {
                        
                        if (Recipe.Info != RecipeDB.Info){
                           
                            Update(this.db, Tables.Recipe, `Name = '${Recipe.Info.Name}', PrepTime = ${Recipe.Info.PrepTime}`, `ID = ${Recipe.Info.ID}`);
                        }
                        if (Recipe.Ing != RecipeDB.Ings){
                            RecipeDB.Ings.forEach((IngDB) => {                                                      //Jede aktuell zugeordnete Zutat durchlaufen
                                var Ingr = Recipe.Ing.find(c => c.IngredientID == IngDB.IngredientID)   
                                if (!Ingr){                                                                         //Wenn Der datenbankeintrag im State gefunden wurde
                                    Delete(this.db, Tables.RecipeIngredients, `ID = ${IngDB.ID}`)
                                }
                                else {
                                    if (Ingr.Amount != IngDB.Amount)
                                        Update(this.db, Tables.RecipeIngredients, `Amount = ${Ingr.Amount}`, `ID = ${Ingr.ID}`);
                                    var removeIndex = Recipe.Ing.map(c => c.ID).indexOf(Ingr.ID);
                                    Recipe.Ing.splice(removeIndex, 1);
                                }
                            })
                            Recipe.Ing.forEach((Ings) => {
                                Insert(this.db, Tables.RecipeIngredients, { RecipeID: RecipeDB.Info.ID, IngredientID: Ings.IngredientID, Amount: Ings.Amount });
                            })
                        }
                        if (Recipe.Step != RecipeDB.Steps){
                            RecipeDB.Steps.forEach((StepDB) => {
                                var Step = Recipe.Step.find(c => c.Text == StepDB.Text || c.StepTime == StepDB.StepTime);
                                if (!Step){
                                    Delete(this.db, Tables.RecipeWorksteps, `ID = ${StepDB.ID}`);
                                }
                                else {
                                    if (Step.Text != StepDB.Text)
                                        Update(this.db, Tables.RecipeWorksteps, `Text = '${Step.Text}'`, `ID = ${StepDB.ID}`);
                                    if (Step.StepTime != StepDB.StepTime)
                                        Update(this.db, Tables.RecipeWorksteps, `StepTime = '${Step.StepTime}'`, `ID = ${StepDB.ID}`);
                                    var removeIndex = Recipe.Step.map(c => c.ID).indexOf(Step.ID);
                                    Recipe.Step.splice(removeIndex, 1);
                                }
                            })
                            Recipe.Step.forEach((Steps) => {
                                
                                Insert(this.db, Tables.RecipeWorksteps, { RecipeID: RecipeDB.Info.ID, Text: Steps.Text, StepTime: Steps.StepTime, OrderNumber: Steps.ID } );
                            })
                        }
                        
                    }).then(() => {
                        console.log(this.props.navigation);
                        this.props.route.params.onGoBack();
                        this.props.navigation.replace("Recipe", {settings: this.state.settings});
                        //this.props.navigation.navigate("Recipe", {settings: this.state.settings});
                        // this.props.navigation.goBack();
                    })
                })
                
            })
                
            
        }
    }

    UpdateInfoState = (infoObj) => {
        this.setState({ Recipe: { Info: infoObj , Ing: this.state.Recipe.Ing, Step: this.state.Recipe.Step }});
    }

    UpdateIngState = (ingArr) => {
        this.setState({ Recipe: { Info: this.state.Recipe.Info , Ing: ingArr, Step: this.state.Recipe.Step }});
    }

    UpdateStepState = (stepArr) => {
        this.setState({ Recipe: { Info: this.state.Recipe.Info , Ing: this.state.Recipe.Ing, Step: stepArr }});
    }

    render() {
        const Tab = createMaterialTopTabNavigator();
        return (
            <Tab.Navigator
                tabBar={props => <RecipeTabBar {...props} settings={this.state.settings} />}
            >
                <Tab.Screen name="RezeptInfo" children={() => <Info OnRecipeSave={this.OnRecipeSave} settings={this.state.settings} Callback={this.UpdateInfoState} Info={this.state.Recipe.Info} />} />
                <Tab.Screen name="Zutaten" children={() => <Ings OnRecipeSave={this.OnRecipeSave} settings={this.state.settings} Callback={this.UpdateIngState} Ings={this.state.Recipe.Ing} action={this.state.action} />}/>
                <Tab.Screen name="Arbeitsschritte" children={() => <Steps OnRecipeSave={this.OnRecipeSave} settings={this.state.settings} Callback={this.UpdateStepState} Steps={this.state.Recipe.Step} />}/>
            </Tab.Navigator>
        )
    }
}