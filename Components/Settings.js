import React, { Component } from 'react';
import ColorPicker from 'react-native-wheel-color-picker';
import { ScrollView, View, Text } from 'react-native';
import { GlobalStyle } from '../style';
import { Tables, DB, CreateTable, Insert, Select, Delete, Update} from '../Database/db';
import SelectDropdown from 'react-native-select-dropdown';
import Lang, { Languages } from '../language';
class Settings extends Component {
    
    constructor(props) {
        super(props);
        this.db = new DB();
        const settings = props.route.params.settings;
        const lang = Lang(settings);
        this.state = {
            settings: settings,
            Lang: lang
        }
        props.navigation.setOptions({ headerStyle: { backgroundColor: this.state.settings.AccentColor}})
        props.navigation.setOptions({ headerTintColor: this.state.settings.FontColor })
        props.navigation.setOptions({ headerTitle: this.state.Lang.StackCaptionSettings })
        this.Languages = Languages;
    }
    
    
    
    OnAccentColorChanged = (color) => {
        Update(this.db, Tables.Settings, `AccentColor = '${color}'`)
        this.setState({ 
            settings: { 
                AccentColor: color,
                MainColor: this.state.settings.MainColor,
                FontColor: this.state.settings.FontColor,
                Language: this.state.settings.Language 
            } 
        });
        this.props.navigation.setOptions({ headerStyle: { backgroundColor: this.state.settings.AccentColor}})
        this.props.route.params.update();
    }

    OnMainColorChanged = (color) => {
        
        Update(this.db, Tables.Settings, `MainColor = '${color}'`)
        this.setState({ 
            settings: { 
                AccentColor: this.state.settings.AccentColor,
                MainColor: color,
                FontColor: this.state.settings.FontColor,
                Language: this.state.settings.Language 
            } 
        });
        this.props.route.params.update();
    }

    OnFontColorChanged = (color) => {
        Update(this.db, Tables.Settings, `FontColor = '${color}'`)
        this.setState({ 
            settings: { 
                AccentColor: this.state.settings.AccentColor,
                MainColor: this.state.settings.MainColor,
                FontColor: color,
                Language: this.state.settings.Language 
            } 
        });
       
        this.props.navigation.setOptions({ headerTintColor: this.state.settings.FontColor })
        this.props.route.params.update();
    }

    OnLanguageChanged = (value) => {
        Update(this.db, Tables.Settings, `Language = '${value}'`)
        var lang = Lang({
            AccentColor: this.state.settings.AccentColor,
            MainColor: this.state.settings.MainColor,
            FontColor: this.state.settings.FontColor,
            Language: value 
        });
        this.setState({ 
            settings: { 
                AccentColor: this.state.settings.AccentColor,
                MainColor: this.state.settings.MainColor,
                FontColor: this.state.settings.FontColor,
                Language: value 
            },
            Lang: lang
        });
        this.props.navigation.setOptions({ headerTitle: lang.StackCaptionSettings })
        this.props.route.params.update();
    }

    render() {
        return (
            <View style={[{height: '100%'}, {backgroundColor: this.state.settings.MainColor}]}>
                <ScrollView style={GlobalStyle.SettingsContainer}>
                    <View style={GlobalStyle.SettingsItem}>
                        <Text style={[GlobalStyle.Caption, {color: this.state.settings.FontColor}]}>{this.state.Lang.SettingsLblMainColor}</Text>
                        <ColorPicker
                            color={this.state.settings.MainColor}
                            onColorChangeComplete={this.OnMainColorChanged}
                        />
                    </View>
                    <View style={GlobalStyle.SettingsItem}>
                        <Text style={[GlobalStyle.Caption, {color: this.state.settings.FontColor}]}>{this.state.Lang.SettingsLblAccentColor}</Text>
                        <ColorPicker
                            color={this.state.settings.AccentColor}
                            onColorChangeComplete={this.OnAccentColorChanged}
                        />
                    </View>
                    <View style={GlobalStyle.SettingsItem}>
                        <Text style={[GlobalStyle.Caption, {color: this.state.settings.FontColor}]}>{this.state.Lang.SettingsLblFontColor}</Text>
                        <ColorPicker
                            color={this.state.settings.FontColor}
                            onColorChangeComplete={this.OnFontColorChanged}
                        />
                    </View>
                    <View style={GlobalStyle.SettingsItem}>
                        <Text style={[GlobalStyle.Caption, {color: this.state.settings.FontColor}, {marginBottom: 20}]}>{this.state.Lang.SettingsLblLanguage}</Text>
                        <SelectDropdown
                            data={this.Languages}
                            buttonStyle={[GlobalStyle.Picker, {backgroundColor: this.state.settings.MainColor}, {borderColor: this.state.settings.FontColor}]}
                            buttonTextStyle={[{color: this.state.settings.FontColor}]}
                            rowStyle={[GlobalStyle.PickerItem, {backgroundColor: this.state.settings.MainColor}, {borderColor: this.state.settings.FontColor}]}
                            rowTextStyle={[{color: this.state.settings.FontColor}]}
                            defaultValue={this.state.settings.Language}
                            defaultButtonText="Sprache auswählen.."
                            onSelect={(selectedItem, index) => {
                                this.OnLanguageChanged(selectedItem);
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem
                            }}
                            rowTextForSelection={(item, index) => {
                                return item
                            }}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default Settings