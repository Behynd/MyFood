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
import { ScrollView } from 'react-native-gesture-handler';
import { PureComponent } from 'react';

class RecipeChange extends Component {
    constructor(props) {
        
        super(props);
        this.db = new DB();
        const settings = props.route.params.settings;
        this.Lang = props.route.params.lang;
        this.Callback = props.Callback;
        
        this.state = {
            MainColor: settings.MainColor,
            AccentColor: settings.AccentColor,
            FontColor: settings.FontColor,
            Language: settings.Language,
            Recipe: props.route.params.Recipe,
            action: props.route.params.action,
            IngDS: [],
            refresh: false,
            selectedView: 'Info'
        }
        
        this.props.navigation.setOptions({ headerStyle: { backgroundColor: this.state.AccentColor}});
        this.props.navigation.setOptions({ headerTintColor: this.state.FontColor })
        this.props.navigation.setOptions({ headerTitle: this.state.action == "add" ? this.Lang.StackCaptionRecipeAdd : this.Lang.StackCaptionRecipeUpdate });
        Select(this.db, Tables.Ingredients).then((Result) => {
            this.setState({ IngDS: Result});
        });

    }

    scrollToIndex = (index) => {
        this.ViewCollection.scrollToIndex({animated: true, index: index});
    }

    onViewChanged = ({ viewableItems, changed}) => {

    }

    AddOpacity(color , opacity) {
        const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
    }

    OnRecipeSave() {
        if (this.state.action == 'add'){
            var id = 0;
            Insert(this.db, Tables.Recipe, { Name: this.state.Recipe.Info.Name, PrepTime: this.state.Recipe.Info.PrepTime }).then((InsertID) => {
                id = InsertID;
                this.state.Recipe.Ing.forEach((Ingredient) => {
                    Insert(this.db, Tables.RecipeIngredients, { RecipeID: InsertID, IngredientID: Ingredient.IngredientID, Amount: Ingredient.Amount });
                });
                this.state.Recipe.Step.forEach((Workstep) => {  
                    Insert(this.db, Tables.RecipeWorksteps, { RecipeID: InsertID, Text: Workstep.Text, StepTime: Workstep.StepTime, OrderNumber: Workstep.ID });
                });
            }).then(() => {
               
                this.state.Recipe.Info.ID = id;
                this.props.navigation.navigate("Recipe", { Recipes: this.state.Recipe });
                
            });   
        }
        else {
            
            var RecipeDB = { Info: {}, Ings: [], Steps: [] };
            var Recipe = JSON.parse(JSON.stringify(this.state.Recipe));
            
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
                        
                        this.props.navigation.navigate("Recipe", {settings: this.props.route.params.settings, Recipe: this.state.Recipe, Lang: this.Lang});
                    })
                })
                
            })
                
            
        }
    }

    

    selectedView = () => {

       

        const renderIngs = ({ item }) => (
            <View style={[GlobalStyle.IngListItem, {backgroundColor: this.state.MainColor, padding: 5}]}>
                <SelectDropdown
                    
                    data={this.state.IngDS}
                    buttonStyle={[GlobalStyle.IngPicker, {backgroundColor: this.state.MainColor}, {borderColor: this.state.FontColor}]}
                    buttonTextStyle={[{color: this.state.FontColor}]}
                    rowStyle={[GlobalStyle.PickerItem, {backgroundColor: this.state.MainColor}, {borderColor: this.state.FontColor}]}
                    rowTextStyle={[{color: this.state.FontColor}]}
                    defaultButtonText={this.state.Recipe.Ing.length != 0 && item.IngredientID ?  this.state.IngDS.find(c => c.ID == item.IngredientID).Name : this.Lang.RecipeMaskIngredientSelect}
                    onSelect={async(selectedItem, index) => {
                        var currentItems = this.state.Recipe.Ing;
                        var currentItem = currentItems.findIndex(c => c.ID == item.ID);
                        currentItems[currentItem].IngredientID = selectedItem.ID;
                        currentItems[currentItem].Unit = this.state.IngDS.find(c => c.ID == selectedItem.ID).Unit;
                        currentItems[currentItem].Name = this.state.IngDS.find(c => c.ID == selectedItem.ID).Name;
                        this.setState({ refresh: !this.state.refresh });
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem.Name
                    }}
                    rowTextForSelection={(item, index) => {
                        return item.Name
                    }}
                />
                <TextInput placeholder={this.Lang.RecipeMaskIngredientAmount} placeholderTextColor={this.state.FontColor} style={[GlobalStyle.IngAmountInput, {color: this.state.FontColor, backgroundColor: this.AddOpacity(this.state.AccentColor, 0.5), borderColor: this.state.FontColor}]} keyboardType='numeric' onChangeText={async(numb) => { item.Amount = numb; var Ing = this.state.Recipe.Ing.map(item => item.ID).indexOf(item.ID); var NewIngs = this.state.Recipe.Ing; NewIngs[Ing].Amount = numb; await this.setState({ Recipe: { Info: this.state.Recipe.Info, Ing: NewIngs, Step: this.state.Recipe.Step  } });  }}>{item.Amount}</TextInput> 
                <Text style={[GlobalStyle.UnitLabel, { color: this.state.FontColor}]}>{ item.Unit }</Text>
                <TouchableOpacity style={GlobalStyle.IngDeleteButton} onPress={() => { var removeIndex = this.state.Recipe.Ing.map(item => item.ID).indexOf(item.ID); 
                                                    var NewIngs = this.state.Recipe.Ing; NewIngs.splice(removeIndex, 1); this.setState({ Recipe: { Info: this.state.Recipe.Info, Ing: NewIngs, Step: this.state.Recipe.Step} }); }}>
                    <Feather name="trash-2" style={[{color: '#ff4d4d'}, {fontSize: 40}]}/>
                </TouchableOpacity>
            </View>
        )

        const renderWorkstep = ({ item }) => (
            <View style={[GlobalStyle.IngListItem, { backgroundColor: this.state.MainColor, padding: 5 }]}>
                <TextInput value={item.Text} placeholderTextColor={this.state.FontColor} placeholder={this.Lang.RecipeMaskWorkstepStep} multiline={true} style={[GlobalStyle.StepTextInput, {borderColor: this.state.FontColor, color: this.state.FontColor, paddingLeft: 15}]}  onChangeText={async(text) => { item.Text = text; var Step = this.state.Recipe.Step.map(item => item.ID).indexOf(item.ID); var NewSteps = this.state.Recipe.Step; NewSteps[Step].Text = text; await this.setState({ Recipe: { Info: this.state.Recipe.Info, Ing: this.state.Recipe.Ing, Step: NewSteps }}); }} />
                <TextInput placeholderTextColor={this.state.FontColor} placeholder={this.Lang.RecipeMaskWorkstepStepTime} keyboardType='numeric' style={[GlobalStyle.StepAmountInput, {borderColor: this.state.FontColor, color: this.state.FontColor, paddingLeft: 15}]} onChangeText={async(numb) => { item.Amount = numb; var Step = this.state.Recipe.Step.map(item => item.ID).indexOf(item.ID); var NewSteps = this.state.Recipe.Step; NewSteps[Step].StepTime = numb; await this.setState({ Recipe: { Info: this.state.Recipe.Info, Ing: this.state.Recipe.Ing, Step: NewSteps }, refresh: this.state.refresh}); }}>{item.StepTime}</TextInput> 
                <TouchableOpacity style={[GlobalStyle.StepDelete]} onPress={async() => { var removeIndex = this.state.Recipe.Step.map(item => item.ID).indexOf(item.ID);
                                                    var NewSteps = this.state.Recipe.Step; NewSteps.splice(removeIndex, 1); await this.setState({ Recipe: { Info: this.state.Recipe.Info, Ing: this.state.Recipe.Ing, Step: NewSteps }, refresh: this.state.refresh}); }}>
                    <Feather name="trash-2" style={[{color: '#ff4d4d'}, {fontSize: 40}]}/>
                </TouchableOpacity>
            </View>
        )

        switch(this.state.selectedView) {
            case 'Info':
                return (
                    <View style={[GlobalStyle.RecipeInfo, {backgroundColor: this.state.MainColor}]}>
                            <TextInput placeholderTextColor={this.state.FontColor} style={[GlobalStyle.RecipeInfoNameInput, {color: this.state.FontColor, borderColor: this.state.FontColor, backgroundColor: this.AddOpacity(this.state.AccentColor, 0.5)}]} onChangeText={async(text) => { await this.setState({ Recipe: { Info: { ID: this.state.Recipe.Info.ID, Name: text, PrepTime: this.state.Recipe.Info.PrepTime}, Ing: this.state.Recipe.Ing, Step: this.state.Recipe.Step}}); }} placeholder={this.Lang.RecipeMaskInfoName}>{this.state.Recipe.Info.Name}</TextInput>
                            <TextInput placeholderTextColor={this.state.FontColor} style={[GlobalStyle.RecipeInfoTimeInput, {color: this.state.FontColor, borderColor: this.state.FontColor, backgroundColor: this.AddOpacity(this.state.AccentColor, 0.5)}]} keyboardType='numeric'  onChangeText={async(numb) => {  numb != '' ? await this.setState({ Recipe: { Info: { ID: this.state.Recipe.Info.ID, PrepTime: parseInt(numb, 10), Name: this.state.Recipe.Info.Name }, Ing: this.state.Recipe.Ing, Step: this.state.Recipe.Step}}) :numb++ ;}} placeholder={this.Lang.RecipeMaskInfoTime}>{this.state.Recipe.Info.PrepTime}</TextInput>
                            <TouchableOpacity onPress={() => { this.OnRecipeSave(); }} style={[GlobalStyle.BtnSave, {backgroundColor: this.state.AccentColor, display: 'flex', flexDirection: 'row', justifyContent: 'center'}]} activeOpacity={0.3}>
                                <Feather name="save" style={[{fontSize: 40}]} />
                            </TouchableOpacity>
                    </View>
                )
            case 'Ings': 
                return (
                    <View style={[{height: '100%'}]}>
                        <FlatList 
                            ref={list => { this.IngList = list }}
                            data={this.state.Recipe.Ing}
                            renderItem={renderIngs}
                            keyExtractor={item => item.ID}
                            extraData={this.state.refresh}
                            style={[{backgroundColor: this.state.MainColor}]}
                        />
                        <TouchableOpacity onPress={() => { var NewIng = this.state.Recipe.Ing;   NewIng.push({ ID: NewIng.length == 0 ? 0 : ((Math.max.apply(Math, NewIng.map(function(o) { return o.ID; }))) + 1), Name: '', Unit: '', Amount: 0, IngredientID: 0 }); this.setState({ Recipe: { Info: this.state.Recipe.Info, Ing: NewIng, Step: this.state.Recipe.Step} });  }} style={[GlobalStyle.BtnSave,{backgroundColor: this.state.AccentColor, display: 'flex', flexDirection: 'row', justifyContent: 'center'}]} activeOpacity={0.3}>
                            <Feather name="plus" style={[{fontSize: 40}]} />
                        </TouchableOpacity>
                    </View>
                )
            case 'Steps': 
                return (
                    <View style={[{height: '100%'}]}>
                        <FlatList 
                            data={this.state.Recipe.Step}
                            renderItem={renderWorkstep}
                            keyExtractor={item => item.ID}
                            style={[{backgroundColor: this.state.MainColor}]}
                            keyboardDismissMode='on-drag'
                        />  
                        <TouchableOpacity onPress={async() => {  var NewStep = this.state.Recipe.Step; NewStep.push({ ID: NewStep.length == 0 ? 0 : ((Math.max.apply(Math, NewStep.map(function(o) { return o.ID; }))) + 1), Text: '', StepTime: 0}); await this.setState({ Recipe: { Info: this.state.Recipe.Info, Ing: this.state.Recipe.Ing, Step: NewStep }, refresh: !this.state.refresh});  }} style={[GlobalStyle.BtnSave,{backgroundColor: this.state.AccentColor, display: 'flex', flexDirection: 'row', justifyContent: 'center'}]} activeOpacity={0.3}>
                            <Feather name="plus" style={[{fontSize: 40}]} />
                        </TouchableOpacity>  
                    </View>
                )

        }
    }

    render() {
        return (
            <View>
                <View style={[GlobalStyle.RecipeListComp, {backgroundColor: this.state.MainColor}]}>
                    <TouchableOpacity onPress={() => { this.setState({ selectedView: 'Info' }); }} style={[GlobalStyle.RecipeListPart, {padding: 5, borderWidth: 5, borderRadius: 15, borderColor: this.state.MainColor}, { backgroundColor: this.state.selectedView == 'Info' ? this.state.FontColor : this.state.MainColor }]} activeOpacity={0.3}>
                        <Feather name="info" style={[{fontSize: 40, marginLeft: 'auto', marginRight: 'auto'}, {color: this.state.selectedView == 'Info' ? this.state.MainColor : this.state.FontColor}]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ selectedView: 'Ings' }); }} style={[GlobalStyle.RecipeListPart, {padding: 5, borderWidth: 5, borderRadius: 15, borderColor: this.state.MainColor}, { backgroundColor: this.state.selectedView == 'Ings' ? this.state.FontColor : this.state.MainColor }]} activeOpacity={0.3}>
                        <Feather name="list" style={[{fontSize: 40, marginLeft: 'auto', marginRight: 'auto'}, {color: this.state.selectedView == 'Ings' ? this.state.MainColor : this.state.FontColor}]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ selectedView: 'Steps' }); }} style={[GlobalStyle.RecipeListPart, {padding: 5, borderWidth: 5, borderRadius: 15, borderColor: this.state.MainColor}, { backgroundColor: this.state.selectedView == 'Steps' ? this.state.FontColor : this.state.MainColor }]} activeOpacity={0.3}>
                        <Feather name="file-text" style={[{fontSize: 40, marginLeft: 'auto', marginRight: 'auto'}, {color: this.state.selectedView == 'Steps' ? this.state.MainColor : this.state.FontColor}]} />
                    </TouchableOpacity>
                </View>
                <View>
                    {this.selectedView()}
                </View>
                
            </View>
        )
    };
}



export default RecipeChange;