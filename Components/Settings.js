import React, { Component } from 'react';
import ColorPicker from 'react-native-wheel-color-picker';
import { ScrollView, View, Text } from 'react-native';
import { GlobalStyle } from '../style';
import { Tables, DB, CreateTable, Insert, Select, Delete, Update} from '../Database/db';
import SelectDropdown from 'react-native-select-dropdown';
import { Languages } from '../language';
class Settings extends Component {
    
    constructor(props) {
        super(props);
        this.db = new DB();
        const settings = props.route.params.settings;
        this.state = {
            MainColor: settings.MainColor,
            AccentColor: settings.AccentColor,
            FontColor: settings.FontColor,
            Language: settings.Language
        }
        props.navigation.setOptions({ headerStyle: { backgroundColor: this.state.AccentColor}})
        props.navigation.setOptions({ headerTintColor: this.state.FontColor })
        this.Languages = Languages;
    }
    
    
    
    OnAccentColorChanged = (color) => {
        Update(this.db, Tables.Settings, `AccentColor = '${color}'`)
        this.setState({
            AccentColor: color,
            MainColor: this.state.MainColor,
            FontColor: this.state.FontColor,
            Language: this.state.Language
        });
        this.props.navigation.setOptions({ headerStyle: { backgroundColor: this.state.AccentColor}})
        this.props.route.params.update();
    }

    OnMainColorChanged = (color) => {
        
        Update(this.db, Tables.Settings, `MainColor = '${color}'`)
        this.setState({
            MainColor: color,
            AccentColor: this.state.AccentColor,
            FontColor: this.state.FontColor,
            Language: this.state.Language
        });
        this.props.route.params.update();
    }

    OnFontColorChanged = (color) => {
        Update(this.db, Tables.Settings, `FontColor = '${color}'`)
        this.setState({
            MainColor: this.state.MainColor,
            AccentColor: this.state.AccentColor,
            FontColor: color,
            Language: this.state.Language
        });
       
        this.props.navigation.setOptions({ headerTintColor: this.state.FontColor })
        this.props.route.params.update();
    }

    OnLanguageChanged = (value) => {
        Update(this.db, Tables.Settings, `Language = '${value}'`)
        this.setState({
            MainColor: this.state.MainColor,
            AccentColor: this.state.AccentColor,
            FontColor: this.state.FontColor,
            Language: value
        });
        this.props.route.params.update();
    }

    render() {
        return (
            <View style={[{height: '100%'}, {backgroundColor: this.state.MainColor}]}>
                <ScrollView style={GlobalStyle.SettingsContainer}>
                    <View style={GlobalStyle.SettingsItem}>
                        <Text style={[GlobalStyle.Caption, {color: this.state.FontColor}]}>Hauptfarbe</Text>
                        <ColorPicker
                            color={this.state.MainColor}
                            onColorChangeComplete={this.OnMainColorChanged}
                        />
                    </View>
                    <View style={GlobalStyle.SettingsItem}>
                        <Text style={[GlobalStyle.Caption, {color: this.state.FontColor}]}>Akzentfarbe</Text>
                        <ColorPicker
                            color={this.state.AccentColor}
                            onColorChangeComplete={this.OnAccentColorChanged}
                        />
                    </View>
                    <View style={GlobalStyle.SettingsItem}>
                        <Text style={[GlobalStyle.Caption, {color: this.state.FontColor}]}>Schriftfarbe</Text>
                        <ColorPicker
                            color={this.state.FontColor}
                            onColorChangeComplete={this.OnFontColorChanged}
                        />
                    </View>
                    <View style={GlobalStyle.SettingsItem}>
                        <Text style={[GlobalStyle.Caption, {color: this.state.FontColor}, {marginBottom: 20}]}>Sprache</Text>
                        <SelectDropdown
                            data={this.Languages}
                            buttonStyle={[GlobalStyle.Picker, {backgroundColor: this.state.MainColor}, {borderColor: this.state.FontColor}]}
                            buttonTextStyle={[{color: this.state.FontColor}]}
                            rowStyle={[GlobalStyle.PickerItem, {backgroundColor: this.state.MainColor}, {borderColor: this.state.FontColor}]}
                            rowTextStyle={[{color: this.state.FontColor}]}
                            defaultValue={this.state.Language}
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