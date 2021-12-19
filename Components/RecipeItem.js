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

export const RecipeListItem = ({ item, settings, deleteRow, updateRow }) => {
    
    const AddOpacity = (color , opacity) => {
        const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
    }
    const [expanded, setExpanded] = useState(false);

    const renderIngredient = ({ item }) => (
        <View style={[GlobalStyle.IngItem, {borderBottomWidth: 1, borderBottomColor: settings.FontColor, padding: 2}]}>
            <Text style={[GlobalStyle.RecipeListPart,{color: settings.FontColor}]}>{item.Name}</Text>
            <Text style={[GlobalStyle.RecipeListPart,{color: settings.FontColor}]}>{item.Amount}</Text>
            <Text style={[GlobalStyle.RecipeListPart,{color: settings.FontColor}]}>{item.Unit}</Text>
        </View>
    )

    const renderWorkstep = ({ item }) => (
        <View style={[GlobalStyle.IngItem, {borderBottomWidth: 1, borderBottomColor: settings.FontColor, padding: 2}]}>
            <Text style={[GlobalStyle.RecipeListPart,{color: settings.FontColor}]}>{item.OrderNumber}</Text>
            <Text style={[GlobalStyle.RecipeListPart,{color: settings.FontColor}]}>{item.Text}</Text>
            <Text style={[GlobalStyle.RecipeListPart,{color: settings.FontColor}]}>{item.StepTime}</Text>
        </View>
    )
    return(
        <View style={[{backgroundColor: settings.MainColor}]}>
            <TouchableOpacity onPress={() => { setExpanded(!expanded) } }>
                <View style={[{padding: 5}, {borderBottomColor: settings.FontColor}, {borderBottomWidth: 1}]}>
                    <View style={[GlobalStyle.ListItem]}>
                        <Text style={[GlobalStyle.ListItemPart, {color: settings.FontColor}]}>{item.Info.Name}</Text>
                        <Text style={[GlobalStyle.ListItemPart, {color: settings.FontColor}]}>{item.Info.PrepTime + " min"}</Text>
                        <TouchableOpacity onPress={() => { deleteRow(item.Info.ID) }}>
                            <Feather name="trash-2" style={[{color: '#ff4d4d'}, {fontSize: 40}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[{marginLeft: 10}]} onPress={() => { updateRow({settings: settings, action: 'add', Recipe: item }) }}>
                            <Feather name="edit" style={[{color: '#425fff'}, {fontSize: 40}]} />
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </TouchableOpacity> 
            {expanded && (
                <View>
                    <View style={[GlobalStyle.IngItem, {marginTop: 10, backgroundColor: AddOpacity(settings.AccentColor, 0.5)}]}>
                        <Text style={[GlobalStyle.RecipeListPart,{color: settings.FontColor, fontWeight: '900', fontSize: 17}]}>Schrittnummer</Text>
                        <Text style={[GlobalStyle.RecipeListPart,{color: settings.FontColor, fontWeight: '900', fontSize: 17}]}>Schritt</Text>
                        <Text style={[GlobalStyle.RecipeListPart,{color: settings.FontColor, fontWeight: '900', fontSize: 17}]}>Zeit</Text>
                    </View>
                    <FlatList 
                        
                        data={ item.Step}
                        renderItem={renderWorkstep}
                        keyExtractor={item => item.ID}
                        listKey={(item, index) => `_key${index.toString()}`}
                        
                    />
                    <View style={[GlobalStyle.IngItem, {marginTop: 10, backgroundColor: AddOpacity(settings.AccentColor, 0.5)}]}>
                        <Text style={[GlobalStyle.RecipeListPart,{color: settings.FontColor, fontWeight: '900', fontSize: 17}]}>Zutat</Text>
                        <Text style={[GlobalStyle.RecipeListPart,{color: settings.FontColor, fontWeight: '900', fontSize: 17}]}>Menge</Text>
                        <Text style={[GlobalStyle.RecipeListPart,{color: settings.FontColor, fontWeight: '900', fontSize: 17}]}>Einheit</Text>
                    </View> 
                    <FlatList 
                        listKey={(item, index) => `_key${index.toString()}`}
                        data={ item.Ing }
                        renderItem={renderIngredient}
                        keyExtractor={item => item.ID}
                        
                    />
                </View>
            )}
        </View>
    )
}