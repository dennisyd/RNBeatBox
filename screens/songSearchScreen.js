import {
    Text,
    TextInput,
    View,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Image,
    Share,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Colors, Fonts, Default } from "../constants/style";
import Ionicons from "react-native-vector-icons/Ionicons";
import BottomMusic from "../components/bottomMusic";
import MainBottomSheet from "../components/mainBottomSheet";
import AddToPlayList from "../components/addToPlayList";
import firestore from '@react-native-firebase/firestore';
import NewPlayList from "../components/newPlayList";
const FIRESTORE = firestore()
// import { snapshotEqual } from "firebase/firestore";
const AllSongScreen = (props) => {
    const { t, i18n } = useTranslation();
    const beatCollection = FIRESTORE.collection('beats')
    const isRtl = i18n.dir() === "rtl";
    const [selectedBeat, setSelectedBeat] = useState({});
    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState("");
    const [allList, setAllList] = useState([])
    const [beatsList, setBeats] = useState([]);
    useEffect(()=>{
        handleFilter()
    },[props])
    useEffect(() =>{
        const unsubscribe = beatCollection.onSnapshot(snpShot =>{
            beatCollection.get().then(snapshot =>{
                let artData = [];
                snapshot.forEach(result =>{
                    artData.push({...result.data(), key: result.id})
                })
                setAllList(artData)
            }) 
        })
        return () =>{
            unsubscribe()
        }
    }, [FIRESTORE])
    useEffect(() =>{
        handleFilter()
    }, [allList])
    const handleFilter = () => {
        console.log('Search Event')
        let searchResult = []
        allList.forEach(item =>{
            
            console.log(search.toLowerCase(), item?.track_name )
            
            if(item?.track_name?.toLowerCase().includes(search.toLowerCase()) ){
                searchResult.push(item)
            }
        })
        setBeats(searchResult)
  
    }
    function tr(key) {
        return t(`searchMusicScreen:${key}`);
    }
    const toggleClose = () => {
        setVisible(!visible);
    };

    const [addPlayList, setAddPlayList] = useState(false);

    const toggleCloseAddPlayList = () => {
        setAddPlayList(!addPlayList);
    };

    const [newPlayList, setNewPlayList] = useState(false);

    const toggleCloseNewPlayList = () => {
        setNewPlayList(!newPlayList);
    };

    const shareMessage = () => {
        setVisible(false);
        Share.share({
            message: toString(),
        });
    };

    const renderItemBeat = ({ item, index }) => {
        const isFirst = index === 0;

        return (
            <View
                style={{
                    marginTop: isFirst ? Default.fixPadding * 1.5 : 0,
                    marginBottom: Default.fixPadding * 1.5,
                    marginHorizontal: Default.fixPadding * 1.5,
                    flexDirection: isRtl ? "row-reverse" : "row",
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        
                        props.navigation.navigate("playScreen", { item })
                    }}
                    style={{
                        flexDirection: isRtl ? "row-reverse" : "row",
                        flex:10,
                        alignItems:"flex-start",
                        alignItems: "center",
                    }}
                >
                    <Image source={{ uri: item.track_thumbnail }} style={{ width: 50, height: 50 }} />

                    <View
                        style={{

                            marginHorizontal: Default.fixPadding,
                            alignItems: isRtl ? "flex-end" : "flex-start",
                            flex: 9,
                        }}
                    >
                        <Text
                            style={[isFirst ? Fonts.SemiBold16Primary : Fonts.SemiBold16White]}
                        >
                            {item.track_name}
                        </Text>
                        <Text
                            style={{
                                ...Fonts.SemiBold14Grey,
                            }}
                        >
                            {item.singer}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { setVisible(true); setSelectedBeat(item) }}
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Ionicons
                        name="ellipsis-vertical"
                        color={Colors.white}
                        size={24}
                        style={{
                            justifyContent: "center",
                        }}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.darkBlue }}>
            <View
                style={{
                    flexDirection: isRtl ? "row-reverse" : "row",
                    backgroundColor: Colors.lightBlack,
                    borderRadius: 10,
                    padding: Default.fixPadding * 0.5,
                    marginHorizontal: Default.fixPadding * 1.5,
                    marginVertical: Default.fixPadding,
                }}
            >
                <Ionicons
                    name="search-outline"
                    color={Colors.lightGrey}
                    size={22}
                    style={{
                        flex: 0.6,
                        justifyContent: "center",
                        alignSelf: "center",
                        marginLeft: isRtl ? 0 : Default.fixPadding * 0.5,
                        marginRight: isRtl ? Default.fixPadding * 0.5 : 0,
                    }}
                />
                <TextInput
                    style={{
                        ...Fonts.SemiBold16White,
                        flex: 9.4,
                        textAlign: isRtl ? "right" : "left",
                        marginHorizontal: Default.fixPadding,
                        paddingVertical: Default.fixPadding * 0.5,
                    }}
                    onChangeText={(text) => setSearch(text)}
                    onEndEditing={handleFilter}
                    value={search}
                    selectionColor={Colors.primary}
                    placeholder={tr("listenTo")}
                    placeholderTextColor={Colors.lightGrey}
                />
            </View>
            {
                beatsList.length === 0 && (
                    <View style={{ flexDirection: isRtl ? "row-reverse" : "row", justifyContent: "center", margin: 25 }}>

                        <Ionicons
                            name={"ios-briefcase-outline"}
                            size={25}
                            color={Colors.grey}
                        />

                        <Text style={{ ...Fonts.Bold20White, color: "grey" }}>No songs to match</Text>
                    </View>
                )
            }
            <FlatList
                data={beatsList}
                renderItem={renderItemBeat}
                keyExtractor={(item) => item.key}
                showsVerticalScrollIndicator={false}
            />

            <MainBottomSheet
                visible={visible}
                onBackButtonPress={toggleClose}
                onBackdropPress={toggleClose}
                close={toggleClose}
                onDownload={() => {
                    toggleClose();
                    props.navigation.navigate("premiumScreen");
                }}
                shareMessage={() => {
                    shareMessage();
                }}
                onPlaylist={() => {
                    toggleClose();
                    setAddPlayList(true);
                }}
                onLyrics={() => {
                    toggleClose();
                    props.navigation.navigate("lyricsScreen");
                }}
                onInformation={() => {
                    toggleClose();
                    props.navigation.navigate("songInformation");
                }}
            />

            <AddToPlayList
                visible={addPlayList}
                onBackButtonPress={toggleCloseAddPlayList}
                onBackdropPress={toggleCloseAddPlayList}
                close={toggleCloseAddPlayList}
                onSelect={() => {
                    setAddPlayList(false);
                    setNewPlayList(true);
                }}
                beat={selectedBeat}
                isClose={toggleCloseAddPlayList}
            />
            <NewPlayList
                visible={newPlayList}
                onBackButtonPress={toggleCloseNewPlayList}
                onBackdropPress={toggleCloseNewPlayList}
                cancel={toggleCloseNewPlayList}
                beat={selectedBeat}
            />

            <BottomMusic onSelect={() => props.navigation.navigate("playScreen")} />
        </SafeAreaView>
    );
};

export default AllSongScreen;
