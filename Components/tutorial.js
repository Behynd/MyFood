import { Component } from "react/cjs/react.development";
import Lang from '../language';
class Tutorial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tutorialSkipped: props.route.params.IsSkiped,
            tutorialStage: props.route.params.Stage,

        }
    }

    getTutorialStage(stage) {
        switch (stage) {
            case 1:
                return (
                    <View>
                        <Text></Text>
                    </View>
                )
            case 2:
                return (
                    <View></View>
                )
            case 3:
                return (
                    <View></View>
                )
            case 4:
                return (
                    <View></View>
                )
            case 5:
                return (
                    <View></View>
                )
            case 6:
                return (
                    <View></View>
                )
            case 7:
                return (
                    <View></View>
                )
            case 8:
                return (
                    <View></View>
                )
            case 9:
                return (
                    <View></View>
                )
           
        }
    }

    render() {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                visible={!this.state.tutorialSkipped}
                
            >
                <View style={[GlobalStyle.Popup, {backgroundColor: "gray"}]}>
                    <Text style={[{height: 300}]}>

                    </Text>
                    <View style={[{flexDirection: "row"}]}>
                        <TouchableOpacity onPress={() => { this.setState({ tutorialSkipped: true }) }}    activeOpacity={0.5}>
                                    <Text style={[{color: "blue"}]}>Skip Tutorial</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[{marginLeft: "auto"}]} onPress={() => {  }}    activeOpacity={0.5}>
                                    <Text style={[{color: "blue"}]}>Go on</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}