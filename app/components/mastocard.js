import React from "react";
import { Text, Image, View, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import PropTypes from "prop-types";

export default class MastoCard extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        card: PropTypes.object,
        sensitive: PropTypes.bool
    };

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.openUrl(this.props.card.url)}>
                    <View style={[styles.mediaview, { width: this.props.width, height: this.props.height }]}>
                        {this.props.card.image && (
                            <Image source={{ uri: this.props.card.image }} style={[styles.media, { width: this.props.width, height: this.props.height }]} blurRadius={this.props.sensitive ? 100 : 0} />
                        )}
                        <FontAwesome name={"link"} size={16} color="black" style={[styles.mediaicon, { width: this.props.width, height: this.props.height }]} />
                        {this.props.sensitive && <FontAwesome name={"exclamation-circle"} size={16} style={styles.mediaiconSensitive} />}
                        <View style={[styles.backgroundView, { width: this.props.width, height: this.props.height }]}>
                            <Text style={styles.description} ellipsizeMode="tail" numberOfLines={3}>
                                {this.titleSetting(this.props.card.title)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    titleSetting(title) {
        if (typeof title === "undefined" || title === null) {
            title = "";
        }
        return title;
    }
    async openUrl(url) {
        try {
            let supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                console.log("not supported url");
            }
        } catch (e) {
            console.error("Linking error", e);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mediaview: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 12,
        paddingTop: 3,
        paddingBottom: 3,
        borderRadius: 8
    },
    media: {
        position: "absolute",
        borderRadius: 8
    },
    mediaicon: {
        margin: 5,
        position: "absolute"
    },
    mediaiconSensitive: {
        margin: 20,
        position: "absolute"
    },
    description: {
        color: "black",
        fontSize: 12
    },
    backgroundView: {
        padding: 5,
        paddingLeft: 30,
        position: "absolute",
        backgroundColor: "#cecece66",
        borderRadius: 8
    }
});