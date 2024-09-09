import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Platform, Text, View, Image, TouchableOpacity, Dimensions, TextInput, ActivityIndicator, Keyboard, Alert } from 'react-native';
import {
    Ionicons
} from '@expo/vector-icons';
import { picts, routx } from "../utilitis";
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useFocusEffect } from "@react-navigation/native"
import { thisiswhat, whatisthis } from "./convertisseur";
import { Magica } from '../database/database';



const HEIGHT = Dimensions.get("window").height;

export default function ConneXion({ navigation }) {
    const [phone, setPhone] = useState();
    const [password, setPassword] = useState();
    const [secure, setSecure] = useState(true);
    const [isloaded, setIsLoaded] = useState(false);
    const [notif, setNotif] = useState("denied");


    useFocusEffect(
        useCallback(() => {
            (async () => {
                try {
                    const secro = await registerForPushNotificationsAsync();
                    if (secro !== "denied") {
                        setNotif(secro);
                    } else {
                        setNotif("denied");
                        if (Platform.OS === 'ios') {
                            Linking.openURL(); // Add appropriate URL
                        } else {
                            Linking.openSettings();
                        }
                    }
                } catch (error) {
                    alert("FCM APNS GENERING: " + error);
                }
            })();
        }, [])
    );

    useEffect(() => {
        const initializeDatabase = async () => {
            try {
                const magica = await Magica.getMagica();

                await magica.execAsync(`
                    PRAGMA journal_mode = WAL;
                    CREATE TABLE IF NOT EXISTS magica_spa (id INTEGER PRIMARY KEY AUTOINCREMENT, token VARCHAR(1000));
                `);

                const firstRow = await magica.getFirstAsync("SELECT * FROM magica_spa WHERE id = 1");

                if (firstRow) {
                    navigation.navigate("Home");
                } else {
                    setIsLoaded(false);
                }

            } catch (error) {
                console.error("Error during database initialization:", error);
                setIsLoaded(false);
            }
        };

        initializeDatabase();
    }, [navigation]);

    const Connect = async () => {
        setIsLoaded(true);
        Keyboard.dismiss();

        const person = {
            phone: phone,
            password: password,
        };

        try {
            if (phone && password) {
                const response = await axios.post(`${routx.Baseurl}magicaconnexion`, person);
                if (response.data.token) {
                    const splo = response.data.token.split("°");
                    const userif = thisiswhat(`${splo[0]}`);
                    if (splo[2] !== "XORVMG") {
                        await axios.put(`${routx.Baseurl}notificationmagicauser/${userif}`, { pushtoken: `${notif}` });

                        const magica = await Magica.getMagica();
                        await magica.runAsync('INSERT INTO magica_spa(token) VALUES (?)', response.data.token);

                        setIsLoaded(false);
                        navigation.navigate("Home");
                    } else {
                        Alert.alert("Authorisation Requise", "Permission Réjeté");
                        setIsLoaded(false);
                    }
                } else {
                    Alert.alert("Information Rejetée", "Veillez saisir correctement vos identifiants");
                    setIsLoaded(false);
                }
            } else {
                Alert.alert("Information Rejetée", "Veillez saisir correctement vos identifiants");
                setIsLoaded(false);
            }
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Information Rejetée", "Veillez saisir correctement vos identifiants");
            setIsLoaded(false);
        }
    };


    async function registerForPushNotificationsAsync() {
        let secro = "denied";
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            };
            if (finalStatus !== 'granted') {
                return "denied";
            };
            secro = (await Notifications.getExpoPushTokenAsync({ projectId: 'f2ea0190-628e-483b-8208-0273a408385c' })).data
        }
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return secro;
    };




    return (
        <View style={hilai.container}>
            <StatusBar animated={true} style="light" backgroundColor="transparent" />

            <LinearGradient
                style={
                    {
                        position: "absolute",
                        height: HEIGHT,
                        width: 200,
                        left: 0,
                        borderTopRightRadius: 120,
                        //zIndex: 2
                    }
                }
                //colors={["#99e6ae", "#009de0", "#faad06", "#00b395"]}
                colors={["#c98115", "#faad06", "#faad06"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 2, y: 0.1 }}
            >
            </LinearGradient>

            <LinearGradient
                style={
                    {
                        position: "absolute",
                        height: HEIGHT,
                        width: 140,
                        right: 0,
                        borderBottomLeftRadius: 70
                    }
                }
                //colors={["#99e6ae", "#009de0", "#faad06", "#00b395"]}
                colors={["#faad06", "#c98115"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
            </LinearGradient>




            <LinearGradient
                style={
                    {
                        position: "absolute",
                        height: 40,
                        width: 40,
                        left: 7,
                        top: 120,
                        borderRadius: 10,
                        elevation: 5
                    }
                }
                //colors={["#99e6ae", "#009de0", "#faad06", "#00b395"]}
                colors={["#fff", "#c98115"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
            </LinearGradient>


            <LinearGradient
                style={
                    {
                        position: "absolute",
                        height: 40,
                        width: 40,
                        left: 15,
                        top: 150,
                        borderRadius: 10,
                        elevation: 5
                    }
                }
                //colors={["#99e6ae", "#009de0", "#faad06", "#00b395"]}
                colors={["#faad06", "#c98115"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
            </LinearGradient>


            <LinearGradient
                style={
                    {
                        position: "absolute",
                        height: 40,
                        width: 40,
                        left: 7,
                        top: 190,
                        borderRadius: 10,
                        elevation: 5
                    }
                }
                //colors={["#99e6ae", "#009de0", "#faad06", "#00b395"]}
                colors={["#faad06", "#c98115"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
            </LinearGradient>



            <LinearGradient
                style={
                    {
                        position: "absolute",
                        height: 40,
                        width: 40,
                        right: 5,
                        bottom: 250,
                        borderRadius: 10,
                        elevation: 5
                    }
                }
                //colors={["#99e6ae", "#009de0", "#faad06", "#00b395"]}
                colors={["#007fbb", "#f0687c"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
            </LinearGradient>


            <LinearGradient
                style={
                    {
                        position: "absolute",
                        height: 40,
                        width: 40,
                        right: 7,
                        bottom: 150,
                        borderRadius: 10,
                    }
                }
                //colors={["#99e6ae", "#009de0", "#faad06", "#00b395"]}
                colors={["#faad06", "#c98115"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
            </LinearGradient>


            <LinearGradient style={{
                width: "25.5%",
                height: "12%",
                elevation: 8,
                backgroundColor: "#faad06",
                borderRadius: 55,
                borderWidth: 10,
                borderColor: "#faad06"
            }}

                //colors={["#99e6ae", "#009de0", "#faad06", "#00b395"]}
                colors={["#faad06", "#faad06"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
                <Image
                    source={picts.logo}
                    resizeMode="cover"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </LinearGradient>

            <View style={{
                width: "100%",
                height: "12%",
                justifyContent: "center",
                alignItems: "center",
                top: -20
            }}>
                <Text style={{
                    fontSize: 28,
                    fontWeight: 400,
                    textTransform: "capitalize",
                    color: "#fff",
                    fontFamily: "Great_Vibes"
                }}>Magica Spa</Text>
            </View>

            <View style={{
                height: 50,
                width: "90%",
                backgroundColor: "#ffffff",
                borderRadius: 11,
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: "2%",
                justifyContent: "space-between",
                shadowOffset: {
                    width: 0,
                    height: 5
                },
                shadowOpacity: 0.4,
                shadowColor: '#000',
                elevation: 4
            }}>
                <View style={{ height: 30, width: 30 }}>
                    <Image
                        source={picts.avatar}
                        resizeMode="center"
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </View>

                <TextInput style={{
                    backgroundColor: 'transparent',
                    fontSize: 17,
                    height: 30,
                    width: "80%",
                    color: '#c98115',
                }}
                    placeholderTextColor={'#aaa'}
                    placeholder={'Numéro de téléphone'}
                    value={phone}
                    keyboardType="phone-pad"
                    onChangeText={text => setPhone(text)}
                />

                <Ionicons name="call" size={20} color={'#eee'} />
            </View>

            <View style={{ height: "5%" }}>

            </View>

            <View style={{
                height: 50,
                width: "90%",
                backgroundColor: "#ffffff",
                borderRadius: 11,
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: "2%",
                justifyContent: "space-between",
                shadowOffset: {
                    width: 0,
                    height: 5
                },
                shadowOpacity: 0.4,
                shadowColor: '#000',
                elevation: 4
            }}>
                <View style={{ height: 30, width: 30, backgroundColor: "#eee", borderRadius: 15, padding: 3, marginRight: 5 }}>
                    <Image
                        source={picts.fingerprint}
                        resizeMode="center"
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </View>

                <TextInput style={{
                    backgroundColor: 'transparent',
                    fontSize: 17,
                    height: 30,
                    width: "80%",
                    color: '#c98115',
                }}
                    placeholderTextColor={'#aaa'}
                    placeholder={'Mot de passe'}
                    value={password}
                    secureTextEntry={secure}
                    onChangeText={text => setPassword(text)}
                />

                <TouchableOpacity style={
                    {
                        height: 30,
                        width: 30,
                        backgroundColor: "transparent",
                        padding: 3
                    }
                } onPress={() => setSecure(se => !se)}>
                    <Ionicons name={secure ? "eye-off" : "eye"} size={20} color={'#eee'} />

                </TouchableOpacity>
            </View>



            <View style={{ height: "5%" }}>

            </View>

            <LinearGradient
                style={
                    {
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 1,
                        shadowColor: '#ccc',
                        elevation: 3,
                        zIndex: 20,
                        borderRadius: 17,
                        width: "40%",
                        alignSelf: "center"
                    }
                }
                colors={["#faad06", "#c98115"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1.5, y: 1 }}
            >
                <TouchableOpacity
                    style={{
                        padding: 8,
                        justifyContent: "center",
                        alignItems: "center"

                    }}
                    onPress={() => Connect()}
                >
                    {isloaded ?
                        <ActivityIndicator
                            visible={isloaded}
                            color="#fff"
                        /> :

                        <Text style={{ color: "#fff", fontWeight: "bold", letterSpacing: 5 }}>Connexion</Text>
                    }

                </TouchableOpacity>
            </LinearGradient>

        </View>

    )
}

const hilai = StyleSheet.create({
    container: {
        backgroundColor: '#faad06',
        height: "100%",
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'scroll'
    },

});