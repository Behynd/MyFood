import React, { Component, useState } from 'react';
import {Text, View, FlatList, Image, Button, TextInputBase, TextInput, UIManager, LayoutAnimation, Platform, Modal, Alert, TouchableOpacity} from 'react-native';
import { GlobalStyle } from '../style';
import { Tables, DB, CreateTable, Insert, Select, Delete, Update} from '../Database/db'
import { validatePathConfig } from '@react-navigation/core';
import { throwStatement } from '@babel/types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ingredient from './Ingredient';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Info, Ings, Steps } from './RecipeMask';
import { NavigationContainer } from '@react-navigation/native';
import { RecipeListItem } from './RecipeItem';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import Lang from '../language';
import { Directions, ScrollView } from 'react-native-gesture-handler';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.db = new DB();
        this.state = {
           settings: {},
           Lang: {
               StackCaptionMenu: 'dwd',
               StackCaptionRecipe: 'dwd',
               StackCaptionPurchaseList: 'dwd',
               StackCaptionScheduler: 'dwd',
               StackCaptionSettings: 'dwd'
           },
           refresh: false
        }
        
    }
    componentDidMount() {
        this.setState({ refresh: !this.state.refresh });
    }
    componentDidUpdate() {
        Select(this.db, Tables.Settings).then((result) => {
            if (result[0].MainColor != this.state.settings.MainColor ||
                result[0].AccentColor != this.state.settings.AccentColor ||
                result[0].FontColor != this.state.settings.FontColor  ||
                result[0].Language != this.state.settings.Language) {
                
                
                this.setState({ 
                    settings: { MainColor: result[0].MainColor, AccentColor: result[0].AccentColor, FontColor: result[0].FontColor, Language: result[0].Language  }
                });
                var lang = Lang(this.state.settings);
                this.setState({ Lang: lang });
                this.props.navigation.setOptions({ headerStyle: { backgroundColor: this.state.settings.AccentColor}});
                this.props.navigation.setOptions({ headerTintColor: this.state.settings.FontColor })
                this.props.navigation.setOptions({ headerTitle: lang.StackCaptionMenu });
            }
        })
    }

    render() {

        const update = () => {
            this.setState({ refresh: !this.state.refresh});
        }

        const renderMenu = ({ item }) => (
            <View>
                <TouchableOpacity  onPress={() => { this.props.navigation.navigate(item.StackName, {settings: this.state.settings, update: update}); }}>
                    <Text>{item.title}</Text>
                    <Image style={GlobalStyle.image} source={require('../Resources/Settings_Icon.png')}></Image>

                    
                </TouchableOpacity>
            </View>
        )

        const Menus = [
            { title: this.state.Lang.StackCaptionIngredients, Image: require('../Resources/Zutat.png'), StackName: 'Ingredient'  },
            { title: this.state.Lang.StackCaptionRecipe, Image:  require('../Resources/Rezept.png'), StackName: 'Recipe'  },
            { title: this.state.Lang.StackCaptionPurchaseList, Image:  require('../Resources/PurchaseLis.png'), StackName: 'PurchaseList'  },
            { title: this.state.Lang.StackCaptionScheduler, Image:  require('../Resources/Scheduler.png'), StackName: 'Scheduler'  },
            { title: this.state.Lang.StackCaptionSettings, Image:  require('../Resources/Settings_Icon.png'), StackName: 'Settings'  },
        ]

        return (
            <View style={[{height: '100%', padding: 30, backgroundColor: this.state.settings.MainColor}]}>
                <ScrollView>
                <TouchableOpacity style={[{display: 'flex', flexDirection: 'row', height: '15%', minHeight: 100, padding: 10, backgroundColor: '#EEB336', borderRadius: 20, marginTop: 10}]}  onPress={() => { this.props.navigation.navigate('Ingredient', {settings: this.state.settings, Lang: this.state.Lang }); }}>
                    <MaterialIcons name='local-restaurant' style={[{fontSize: 80}]} ></MaterialIcons>
                    <Text style={[{fontSize: 30, textAlignVertical: 'center', width: '65%', textAlign: 'center', color: this.state.settings.FontColor}]}>{this.state.Lang.StackCaptionIngredients}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[{display: 'flex', flexDirection: 'row', height: '15%', minHeight: 100, padding: 10, backgroundColor: '#3B8E30', borderRadius: 20, marginTop: 10}]}  onPress={() => { this.props.navigation.navigate('Recipe', {settings: this.state.settings, Lang: this.state.Lang }); }}>
                    <MaterialIcons name='receipt' style={[{fontSize: 80}]} ></MaterialIcons>
                    <Text style={[{fontSize: 30, textAlignVertical: 'center', width: '65%', textAlign: 'center', color: this.state.settings.FontColor}]}>{this.state.Lang.StackCaptionRecipe}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[{display: 'flex', flexDirection: 'row', height: '15%', minHeight: 100, padding: 10, backgroundColor: '#B9B9B9', borderRadius: 20, marginTop: 10}]}  onPress={() => { this.props.navigation.navigate('Scheduler', {settings: this.state.settings}); }}>
                    <MaterialIcons name='event-note' style={[{fontSize: 80}]} ></MaterialIcons>
                    <Text style={[{fontSize: 30, textAlignVertical: 'center', width: '65%', textAlign: 'center', color: this.state.settings.FontColor}]}>{this.state.Lang.StackCaptionScheduler}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[{display: 'flex', flexDirection: 'row', height: '15%', minHeight: 100, padding: 10, backgroundColor: '#882EA2', borderRadius: 20, marginTop: 10}]}  onPress={() => { this.props.navigation.navigate('Scheduler', {settings: this.state.settings}); }}>
                    <MaterialIcons name='list' style={[{fontSize: 80}]} ></MaterialIcons>
                    <Text style={[{fontSize: 30, textAlignVertical: 'center', width: '65%', textAlign: 'center', color: this.state.settings.FontColor}]}>{this.state.Lang.StackCaptionPurchaseList}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[{display: 'flex', flexDirection: 'row', height: '15%', minHeight: 100, padding: 10, backgroundColor: '#2F667A', borderRadius: 20, marginTop: 10}]}  onPress={() => { this.props.navigation.navigate('Settings', {settings: this.state.settings, update: update}); }}>
                    {/* <Image style={[{height: '100%', width: 90}]} source={require('../Resources/Settings_Icon.png')}></Image> */}
                    <MaterialIcons name='settings' style={[{fontSize: 80}]} ></MaterialIcons>
                    <Text style={[{fontSize: 30, textAlignVertical: 'center', width: '75%', textAlign: 'center', color: this.state.settings.FontColor}]}>{this.state.Lang.StackCaptionSettings}</Text>
                </TouchableOpacity>
                </ScrollView>
             
            </View>
        )
    }
}

export default Menu;