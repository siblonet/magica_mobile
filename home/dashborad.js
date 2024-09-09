import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, Platform, ActivityIndicator, Dimensions, ScrollView, Text, View, Image, TouchableOpacity, Animated, TextInput, SafeAreaView, Alert, AppState } from 'react-native';
import {
    Ionicons, MaterialCommunityIcons
} from '@expo/vector-icons';
import { picts, routx } from "../utilitis";
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from "expo-linear-gradient";
import { Magica } from '../database/database';
import { useFocusEffect } from "@react-navigation/native"
import axios from "axios";
import { thisiswhat, whatisthis } from "./convertisseur";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function DashBoard({ navigation }) {
    const [isloaded, setIsLoaded] = useState(false);
    const [token, setToken] = useState();
    const [unlock, setUnlock] = useState(false);
    const [user_id, setUser_id] = useState();


    const [data, Data] = useState([]);
    const [datao, Datao] = useState([]);
    const [loading, setLoadding] = useState(false);
    const [loaderro, setLoadderro] = useState(false);


    const [typin, setTypin] = useState("");
    const [isEmpty, setIsEmpty] = useState(false);

    /**
     * 
     * const splo = token.split("°");
        //const perset = `${_id}°${name}°${role}°${phone}°${allow}°${email}°${address}`;
    
            const userid_rendez = document.getElementById("userid_rendez");
            userid_rendez.value = thisiswhat(`${splo[0]}`);
    
            const full_name = document.getElementById("full_name");
            full_name.value = thisiswhat(`${splo[1]}`);
            full_name.disabled = true;
            const phonea = document.getElementById("phone");
            phonea.value = thisiswhat(`${splo[3]}`);
            phonea.disabled = true;
            const emaila = document.getElementById("email");
            emaila.value = thisiswhat(`${splo[5]}`);
            emaila.disabled = true;
            const addressa = document.getElementById("address");
            addressa.value = thisiswhat(`${splo[6]}`);
     */


    useFocusEffect(
        useCallback(() => {
            const initializeDatabase = async () => {
                try {
                    const magica = await Magica.getMagica();

                    const tables = await magica.getAllAsync(
                        "SELECT name FROM sqlite_master WHERE type='table' AND name='magica_spa'"
                    );

                    if (tables.length === 0) {
                        await magica.execAsync(`
                                    DROP TABLE IF EXISTS magica_spa;
                                    CREATE TABLE IF NOT EXISTS magica_spa (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        token VARCHAR(1000)
                                    );
                                `);
                        setIsLoaded(false);
                        console.log("Deleted and created table.");
                        navigation.navigate("Connexion");
                    } else {
                        const results = await magica.getAllAsync(
                            "SELECT * FROM magica_spa WHERE id ='1'"
                        );

                        if (results.length === 1) {
                            setToken(results[0].token);
                            const user = thisiswhat(`${results[0].token}`).split("°");
                            setUser_id(user[0]);
                            Reloader(); // Assuming Reloader is a function
                        } else {
                            navigation.navigate("Connexion");
                            setIsLoaded(false);
                        }
                    }
                } catch (error) {
                    console.error("Error executing SQL:", error);
                    setIsLoaded(false);
                }
            };

            initializeDatabase();
        }, [])
    );



    useEffect(() => {
        registerForPushNotificationsAsync();
        //schedulePushNotification();
    }, []);



    async function registerForPushNotificationsAsync() {
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                if (Platform.OS === 'ios') {
                    Linking.openURL();
                } else {
                    Linking.openSettings();
                }
                return;
            }

        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C'
            });
        }

        return true;
    }


    async function schedulePushNotification() {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "You've got mail! 📬",
                body: 'Here is the notification body',
                data: { owner: 'Nuance', admin: "", name: "John" },
            },
            trigger: { seconds: 5 },
        });
    }



    function Chertcha(typ) {
        if (datao) {
            let a1 = datao.filter(s => s.client.phone.startsWith(typ, 0))
            if (a1.length !== 0) {
                setIsEmpty(false);
                Data(a1);
            }
            else {
                setIsEmpty(true);
                Data([]);
            }
        }

    }





    const Reloader = () => {
        setLoadderro(false);
        setLoadding(true);
        Data([]);
        Datao([]);



        axios.get(`${routx.Baseurl}magicaappointmentgettingall`).then((dat) => {
            Data(dat.data);
            Datao(dat.data);
            setLoadding(false);
            setUnlock(true);
        }).catch((error) => {
            console.log(error);
            setLoadderro(true);
            setLoadding(false);
        });
    }



    return (
        <>
            {unlock ?
                <SafeAreaView style={hilai.containe}>
                    <StatusBar style={"light"} />
                    <View style={
                        {
                            height: 150,
                            width: "100%",
                            backgroundColor: "#000",
                            overflow: "hidden",
                            opacity: 1,
                            borderBottomRightRadius: 25,
                            borderBottomLeftRadius: 25
                        }
                    }>

                        <LinearGradient
                            //colors={["#411d49", "#48379f", "#99e6ae", "#b41578", "#ffbb28", "#ffbb28"]}
                            colors={["#411d49", "#ffbb28", "#b41578", "#99e6ae", "#009de0", "#009de0"]}
                            start={{ x: 0.0, y: 1.0 }}
                            end={{ x: 1.0, y: 1.5 }}
                            style={{ height: "100%", width: "100%" }}

                        >
                            <View style={{ height: 35 }}></View>
                            <TouchableOpacity style={{
                                width: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",
                                zIndex: 99
                            }} onPress={() => navigation.navigate("Profile")}>

                                <TouchableOpacity style={
                                    {
                                        height: 35,
                                        width: 35,
                                        backgroundColor: "#faad06",
                                        borderRadius: 20,
                                        padding: 2
                                    }
                                } onPress={() => navigation.navigate("Profile")}>
                                    <Image
                                        source={picts.logo}
                                        resizeMode="contain"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    />
                                </TouchableOpacity>


                                <Text style={{
                                    fontSize: 28,
                                    fontWeight: 400,
                                    textTransform: "capitalize",
                                    color: "#fff",
                                    fontFamily: "Great_Vibes"
                                }}>Magica Spa</Text>
                            </TouchableOpacity>


                            <View style={
                                {
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                    paddingVertical: 7,
                                    paddingHorizontal: "4%"
                                }
                            }>
                                <LinearGradient
                                    style={
                                        {
                                            borderRadius: 12,
                                            elevation: 5,
                                            width: "25%",
                                            zIndex: 1
                                        }
                                    }
                                    colors={["#ffc024", "#bd177d"]}
                                    start={{ x: 0.1, y: 0.2 }}
                                    end={{ x: 1, y: 1.1 }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            width: "100%",
                                            backgroundColor: "transparent",
                                            borderRadius: 7,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            paddingVertical: 5,
                                            paddingHorizontal: 5,
                                            position: "relative",

                                        }}
                                        onPress={() => navigation.navigate("Servcies", { worker: user_id, type: "PACKAGE" })}
                                    >
                                        <Ionicons name="chevron-back" size={20} style={{ color: "#fff", left: -3 }} />

                                        <Text style={
                                            {
                                                fontSize: 14,
                                                color: "#fff",
                                                fontWeight: "100",
                                                fontFamily: "Great_Vibes",
                                                right: 3
                                            }
                                        }>
                                            Package
                                        </Text>

                                    </TouchableOpacity>
                                </LinearGradient>


                                <LinearGradient
                                    style={
                                        {
                                            borderRadius: 12,
                                            elevation: 5,
                                            width: "30%",
                                            zIndex: 1,
                                            opacity: 0.8
                                        }
                                    }
                                    colors={["#99e6ae", "#009de0"]}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            width: "100%",
                                            backgroundColor: "transparent",
                                            borderRadius: 7,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            paddingVertical: 5,
                                            paddingHorizontal: 5,
                                            position: "relative",

                                        }}
                                        onPress={() => navigation.navigate("Servcies", { worker: user_id, type: "PARTICULIER" })}
                                    >
                                        <Text style={
                                            {
                                                fontSize: 14,
                                                color: "#D51A65",
                                                fontWeight: "100",
                                                fontFamily: "Great_Vibes",
                                            }
                                        }>
                                            Particulier
                                        </Text>

                                        <Ionicons name="chevron-forward" size={20} style={{ color: "#D51A65" }} />
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>

                            <View style={
                                {
                                    height: 200,
                                    width: "100%",
                                    position: "absolute",
                                    top: 48,
                                    zIndex: 0
                                }
                            }>

                                <Image
                                    source={picts.decora}
                                    resizeMode="stretch"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        tintColor: "#D51A65"
                                    }}
                                />
                            </View>
                        </LinearGradient>
                    </View>


                    <View style={
                        {
                            height: 200,
                            width: "100%",
                            position: "absolute",
                            top: 48,
                            zIndex: -1
                        }
                    }>

                        <Image
                            source={picts.decora}
                            resizeMode="stretch"
                            style={{
                                width: "100%",
                                height: "100%",
                                tintColor: "#D51A65"
                            }}
                        />
                    </View>

                    <View
                        style={{
                            width: "100%",
                            paddingHorizontal: "3%"
                        }}
                    >

                        <View style={{ height: 15 }}></View>

                        <View style={{
                            flexDirection: 'row',
                            alignSelf: 'center',
                            width: "100%",
                            alignItems: 'center',
                            borderRadius: 10,
                            height: 40,
                            backgroundColor: '#fff',
                            shadowOffset: {
                                width: 0,
                                height: 5,
                            },
                            shadowOpacity: 1,
                            shadowColor: '#201d1d',
                            alignSelf: 'center'
                        }}>
                            <Ionicons
                                name='search'
                                size={25}
                                color={"#aaa"}
                                style={{
                                    alignSelf: 'center',
                                    zIndex: 3,
                                    paddingLeft: 5,
                                }}
                            />
                            <TextInput style={{
                                paddingLeft: 12,
                                backgroundColor: 'transparent',
                                borderRadius: 10,
                                fontSize: 17,
                                height: 30,
                                width: "77%",
                                color: '#009de0',
                            }}
                                onEndEditing={() => {
                                    if (typin.length < 1) {
                                        setIsEmpty(false)
                                        Data(datao)
                                    }
                                }}
                                placeholderTextColor={'#aaa'}

                                placeholder={'Cherchez avec numéro de tél'}
                                value={typin} onChangeText={text => { setTypin(text), Chertcha(text) }}
                            />

                        </View>



                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={
                                {
                                    height: 400,
                                    backgroundColor: "transparent",
                                    width: "100%",
                                    paddingVertical: 7,
                                    paddingHorizontal: "4%",
                                    overflow: "scroll"
                                }
                            }>

                            <Text style={{ fontSize: 20, color: "#333", fontFamily: "Great_Vibes" }}>
                                Listes des rendez-vous
                            </Text>

                            <View style={{ height: 10 }}></View>

                            {data.length < 1 &&
                                <TouchableOpacity style={{
                                    height: 200,
                                    width: 300,
                                    alignSelf: "center",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "tranparent",
                                    borderRadius: 20,
                                }} onPress={() => Reloader()}>
                                    <View style={{ position: "absolute", height: "100%", width: "100%", backgroundColor: "#99e6ae", opacity: 0.6, borderRadius: 20 }}>

                                    </View>
                                    {loading ?
                                        <ActivityIndicator
                                            visible={loading}
                                            color="#000"
                                            size={"large"}
                                        />

                                        :
                                        <Ionicons
                                            name="refresh-outline"
                                            size={50}
                                            resizeMode="contain"
                                            style={{
                                                color: "#000",

                                            }}
                                        />
                                    }

                                    {loaderro &&
                                        <Text style={{ fontSize: 20, color: '#ff0000', alignSelf: "center", fontFamily: "Great_Vibes", fontWeight: "400" }}>Échec de chargement</Text>
                                    }


                                    {!loading && !loaderro &&
                                        <Text style={{ fontSize: 20, color: '#000', fontWeight: "400", alignSelf: "center", fontFamily: "Great_Vibes" }}>Vide (actualiser)</Text>

                                    }

                                </TouchableOpacity>

                            }

                            {data.length > 0 &&

                                data.map(((appoint, index) => {
                                    return (
                                        <View key={appoint._id} style={
                                            {
                                                borderRadius: 12,
                                                elevation: 3,
                                                width: "97%",
                                                padding: 15,
                                                alignSelf: "center",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: "#fff",
                                                marginBottom: index + 1 == data.length ? 50 : 15
                                            }
                                        }>
                                            <TouchableOpacity
                                                style={{
                                                    width: "100%",
                                                    backgroundColor: "transparent",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    position: "relative",

                                                }}
                                                onPress={() =>
                                                    navigation.navigate("ViewOrder",
                                                        {
                                                            all: appoint,
                                                            user_id: user_id
                                                        })
                                                }
                                            >
                                                <View style={{
                                                    width: "100%",
                                                    backgroundColor: "transparent",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                }}>

                                                    <View style={
                                                        {
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                        }
                                                    }>


                                                        <View style={{ alignItems: "center", justifyContent: "center", width: 35 }}>
                                                            <View style={
                                                                {
                                                                    width: "75%",
                                                                    backgroundColor: "#bd177d",
                                                                    height: 15,
                                                                    bottom: -3,
                                                                    opacity: 0.7,
                                                                    borderRadius: 7,
                                                                    alignSelf: "flex-start"
                                                                }
                                                            }
                                                            ></View>

                                                            <Text style={{ fontSize: 18, color: "#99e6ae", fontWeight: "bold", position: "absolute", top: 0 }}>
                                                                {index + 1}
                                                            </Text>
                                                            <View style={
                                                                {
                                                                    width: "75%",
                                                                    backgroundColor: "#bd177d",
                                                                    height: 15,
                                                                    top: -3,
                                                                    borderRadius: 7,
                                                                    opacity: 0.4,
                                                                    elevation: 5,
                                                                    alignSelf: "flex-end"

                                                                }
                                                            }
                                                            ></View>

                                                        </View>
                                                        <View style={{ width: 20 }}></View>

                                                        <Text style={{ fontSize: 15, color: "#009de0" }}>
                                                            {appoint.services.servicetype === "PACKAGE" ? "Package" : "Particulier"}
                                                        </Text>

                                                    </View>
                                                    <Text style={{ fontSize: 15, color: "#aaaaaa", fontWeight: "bold" }}>
                                                        {appoint.client.phone}
                                                    </Text>
                                                </View>
                                                <View style={{ alignItems: "flex-start", justifyContent: "flex-start", alignSelf: "flex-start" }}>
                                                    <Text style={{ fontSize: 14, color: "#ccc", fontWeight: "400" }}>
                                                        Le {appoint.dete} à {appoint.heure}:00
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }))}

                        </ScrollView>
                    </View>
                </SafeAreaView>
                :
                <View style={
                    {
                        height: "100%",
                        width: "100%",
                        backgroundColor: "#c98115",
                        alignItems: "center",
                        justifyContent: "center"
                    }
                }>
                    <StatusBar animated={true} style="light" backgroundColor="transparent" />


                    <View
                        style={{
                            height: 200,
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={picts.logo} // Replace with your user's image source
                            style={{
                                height: 200,
                                width: 200,
                            }}
                        />
                        <View style={{ height: 20 }}></View>

                        <ActivityIndicator
                            visible={loading}
                            color="#fff"
                            size={"large"}
                        />
                    </View>
                </View>

            }
        </>
    )
}

const hilai = StyleSheet.create({
    containe: {
        alignItems: "center",
        height: HEIGHT,
        width: WIDTH,
        backgroundColor: "#eee"
    },
});