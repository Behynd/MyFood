import React, { Component, useState } from 'react';
import {Text, View, FlatList, Button, TextInputBase, TextInput, UIManager, LayoutAnimation, Platform, Modal, Alert, TouchableOpacity} from 'react-native';
import { GlobalStyle } from '../style';
import { Tables, DB, CreateTable, Insert, Select, Delete, Update} from '../Database/db';
import { validatePathConfig } from '@react-navigation/core';
import { throwStatement } from '@babel/types';
import Feather from 'react-native-vector-icons/Feather';
import Ingredient from './Ingredient';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Info, Ings, Steps } from './RecipeMask';
import { NavigationContainer } from '@react-navigation/native';
import { RecipeListItem } from './RecipeItem';
import { createIconSetFromFontello } from 'react-native-vector-icons';

class RecipeItem extends Component {
    constructor(props) {
        super(props);
        this.db = new DB();
        this.state = { IsExpanded: false };
        this.settings = props.settings;
    }

    onPress = () => {
        this.setState({ IsExpanded: !this.state.IsExpanded })
        
    }

    AddOpacity(color , opacity) {
        const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
    }

    renderIngredient = ({ item }) => (
        <View style={[GlobalStyle.IngItem, {borderBottomWidth: 1, borderBottomColor: this.settings.FontColor, padding: 2}]}>
            <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor}]}>{item.IngredientName}</Text>
            <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor}]}>{item.Amount}</Text>
            <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor}]}>{item.IngredientUnit}</Text>
        </View>
    )

    renderWorkstep = ({ item }) => (
        <View style={[GlobalStyle.IngItem, {borderBottomWidth: 1, borderBottomColor: this.settings.FontColor, padding: 2}]}>
            <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor}]}>{item.OrderNumber}</Text>
            <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor}]}>{item.Text}</Text>
            <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor}]}>{item.StepTime}</Text>
        </View>
    )

    renderDetails = () => (
        <View>
            <View style={[GlobalStyle.IngItem, {marginTop: 10, backgroundColor: this.AddOpacity(this.settings.AccentColor, 0.5)}]}>
                <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor, fontWeight: '900', fontSize: 17}]}>Schrittnummer</Text>
                <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor, fontWeight: '900', fontSize: 17}]}>Schritt</Text>
                <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor, fontWeight: '900', fontSize: 17}]}>Zeit</Text>
            </View>
            <FlatList 
                ref={list => { this.WorkstepList = list }}
                data={ this.props.item.RecipeWorksteps}
                renderItem={this.renderWorkstep}
                keyExtractor={item => item.ID}
                listKey='RecipeWorksteps'
                
            />
            <View style={[GlobalStyle.IngItem, {marginTop: 10, backgroundColor: this.AddOpacity(this.settings.AccentColor, 0.5)}]}>
                <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor, fontWeight: '900', fontSize: 17}]}>Zutat</Text>
                <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor, fontWeight: '900', fontSize: 17}]}>Menge</Text>
                <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor, fontWeight: '900', fontSize: 17}]}>Einheit</Text>
            </View> 
            <FlatList 
                ref={list => { this.IngredientList = list }}
                data={ this.props.item.RecipeIngredients }
                renderItem={this.renderIngredient}
                keyExtractor={item => item.ID}
                
            />
        </View>
    )

    deleteRecipe = (RecipeID) => {
        // Delete(this.db, Tables.RecipeIngredients, `RecipeID = ${RecipeID}`);
        // Delete(this.db, Tables.RecipeWorksteps, `RecipeID = ${RecipeID}`);
        // Delete(this.db, Tables.Recipe, `ID = ${RecipeID}`);
        this.props.Update();
    }


    render() {
        const  IsExpanded  = this.state.IsExpanded;
        return(
            <View style={[{backgroundColor: this.settings.MainColor}]}>
                <TouchableOpacity onPress={this.onPress}>
                    <View style={[{padding: 5}, {borderBottomColor: this.settings.FontColor}, {borderBottomWidth: 1}]}>
                        <View style={[GlobalStyle.ListItem]}>
                            <Text style={[GlobalStyle.ListItemPart, {color: this.settings.FontColor}]}>{this.props.item.Name}</Text>
                            <Text style={[GlobalStyle.ListItemPart, {color: this.settings.FontColor}]}>{this.props.item.PrepTime + " min"}</Text>
                            <TouchableOpacity onPress={() => { this.deleteRecipe(this.props.item.ID) }}>
                                <Feather name="trash-2" style={[{color: '#ff4d4d'}, {fontSize: 40}]}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={[{marginLeft: 10}]} onPress={() => {  }}>
                                <Feather name="edit" style={[{color: '#425fff'}, {fontSize: 40}]} />
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </TouchableOpacity>
                {IsExpanded && this.renderDetails()}
            </View>
            
            
        )
    }
}

class Recipe extends Component {
    constructor(props) {
        
        super(props);
        this.db = new DB();
        this.state = {
            Recipes: [],
            modalVisible: false,
            Update: false,
            IsExpanded: false,
        }
        this.props = props;
        if (Platform.OS == 'android') {
            UIManager.setLayoutAnimationEnabledExperimental && 
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        
        
        
        this.settings = props.route.params.settings;
        this.getRecipeDataSource();
        props.navigation.setOptions({ headerStyle: { backgroundColor: this.settings.AccentColor}})
        props.navigation.setOptions({ headerTintColor: this.settings.FontColor })
    }

    componentDidUpdate() {
       
        var Recipe = this.props.route.params.Recipes;
        var RecipeList = this.state.Recipes;
        if (Recipe && !RecipeList.includes(Recipe, 0)) {
            var list = this.state.Recipes;
            list.push(this.props.route.params.Recipes);
            delete this.props.route.params.Recipes;
            this.setState({ Recipes: list });
        }
        
    }

    getDerived

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

    AddOpacity(color , opacity) {
        const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
    }
    
    // renderReicpe = ({ item }) => <RecipeItem item={item} settings={this.settings} Update={this.refreshList} />;

    refreshList(Recipe) {
        // if (this.state.action == "add") {
        //     var list = this.state.Recipes;
        //     list.push(Recipe);
        //     this.setState({ Recipes: list });
        // }
        // else {
        //     var list = this.state.Recipes;
            
        // }
        
        // console.log("Callback function has been called")
         // console.log(this.state);
        // this.setState({ Update: !this.state.Update});
    }
    getRecipeDataSource() {
        
        var RecipesData = [];
        
        Select(this.db, Tables.Ingredients).then((Ingredients) => {
            
            this.Ingredients = Ingredients;
            Select(this.db, Tables.RecipeIngredients).then((RecipeIngredients) => {
                
                Select(this.db, Tables.RecipeWorksteps).then((RecipeWorksteps) => {
                    
                    Select(this.db, Tables.Recipe).then((Recipes) => {
                        
                            Recipes.forEach((recipe) => {
                                var Recipe = {};
                                Recipe.Info = { ID: recipe.ID, Name: recipe.Name, PrepTime: recipe.PrepTime };
                                var recipeWorksteps = RecipeWorksteps.filter(c => c.RecipeID == recipe.ID);
                                Recipe.Step = recipeWorksteps;
                                var recipeIngredients = RecipeIngredients.filter(c => c.RecipeID == recipe.ID);
                                


                                // var recipeSheet = recipe;
                                
                                // recipeSheet.Step = recipeWorksteps;
                                 //var recipeIngredients = RecipeIngredients.filter(c => c.RecipeID == recipe.ID);
                                recipeIngredients.forEach((recipeIng) => {
                                    var ing = Ingredients.find(c => c.ID == recipeIng.IngredientID);
                                    recipeIng.Name = ing.Name;
                                    recipeIng.Unit = ing.Unit;
                                })
                                // recipeSheet.Ing = recipeIngredients;
                                Recipe.Ing = recipeIngredients;
                                RecipesData.push(Recipe);
                            })
                           
                            this.setState({ Recipes: RecipesData});
                            
                    })
                })
            });
       }) 
    }

    renderIngredient = ({ item }) => (
        <View style={[GlobalStyle.IngItem, {borderBottomWidth: 1, borderBottomColor: this.settings.FontColor, padding: 2}]}>
            <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor}]}>{item.IngredientName}</Text>
            <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor}]}>{item.Amount}</Text>
            <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor}]}>{item.IngredientUnit}</Text>
        </View>
    )

    renderWorkstep = ({ item }) => (
        <View style={[GlobalStyle.IngItem, {borderBottomWidth: 1, borderBottomColor: this.settings.FontColor, padding: 2}]}>
            <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor}]}>{item.OrderNumber}</Text>
            <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor}]}>{item.Text}</Text>
            <Text style={[GlobalStyle.RecipeListPart,{color: this.settings.FontColor}]}>{item.StepTime}</Text>
        </View>
    )
   
    deleteRecipe = (RecipeID) => {
        Delete(this.db, Tables.RecipeIngredients, `RecipeID = ${RecipeID}`);
        Delete(this.db, Tables.RecipeWorksteps, `RecipeID = ${RecipeID}`);
        Delete(this.db, Tables.Recipe, `ID = ${RecipeID}`);
        var NewRecipes = this.state.Recipes;
        var RemovedIndex = NewRecipes.map(c => c.ID).indexOf(RecipeID)
        NewRecipes.splice(RemovedIndex, 1);
        this.SetAnimation();
        this.setState({ Recipes: NewRecipes })
    }

    updateRow = (item) => {
        
        item.action = 'update';
        item.Recipe.Info = { ID: item.Recipe.ID, Name: item.Recipe.Name, PrepTime: item.Recipe.PrepTime };
        item.Recipe.Ing = item.Recipe.RecipeIngredients;
        item.Recipe.Step = item.Recipe.RecipeWorksteps;
        item.refresh = this.refreshList;
        this.props.navigation.navigate('RecipeMask', item);
    }

    render() {
        
        const renderRecipe = ({ item }) => {
            return (
                <RecipeListItem item={item} settings={this.settings} deleteRow={this.deleteRecipe} updateRow={this.updateRow} />
            )
        }

        return (
            <View style={[{height: '100%'}]}>
                <FlatList 
                    ref={list => {this.RecipeList = list }}
                    data={this.state.Recipes}
                    renderItem={renderRecipe}
                    keyExtractor={item => item.Info.ID}
                    listKey="Recipe"
                />
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View>
                        
                            
                        
                    </View>
                    <View style={GlobalStyle.ListItem}>
                        <TouchableOpacity onPress={() => { this.setState({ modalVisible: false }) }} style={[{backgroundColor: this.settings.MainColor}, {padding: 5}, {borderColor: this.settings.MainColor}, {borderWidth: 1}, {borderRadius: 10}]}   activeOpacity={0.5}>
                            <Feather name="chevron-left"  style={[GlobalStyle.ModalButtons, {color: this.settings.FontColor}]} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[{backgroundColor: this.settings.MainColor}, {padding: 5}, {borderColor: this.settings.MainColor}, {borderWidth: 1}, {borderRadius: 10}]} onPress={() => {  }}  activeOpacity={0.5}>
                            <Feather name="check" style={[GlobalStyle.ModalButtons, {color: this.settings.FontColor}]}/>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('RecipeMask', {settings: this.settings, action: 'add', refresh: this.refreshList, Recipe: { Info: {Name: '', PrepTime: 0}, Ing: [{ ID: 0, Name: '', Unit: '', Amount: 0 }], Step: [{ ID: 0, Text: '', StepTime: 0, OrderNumber: 0 }] }}) }} style={[{backgroundColor: this.settings.AccentColor, display: 'flex', flexDirection: 'row', justifyContent: 'center'}]} activeOpacity={0.3}>
                    <Feather name="plus" style={[{fontSize: 40}]} />
                </TouchableOpacity>
            </View>
        )
    }
}

export default Recipe