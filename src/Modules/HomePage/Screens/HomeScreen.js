import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { cn, useThemedColors } from '../../Theming';
import { Svgs } from '../../../StylingConstants';
import getStyles from '../styles/HomeScreenStyles';
import Icon from '../../../Components/Icon';
import { useDispatch } from 'react-redux';
import { changeMode } from '../../RoutinePages/Redux/RoutineRedux';
import Item from '../Components/Item';
import EmptyComponent from '../Components/EmptyComponent'
import { subscribeToItemData } from '../../RoutinePages/API/Firebase';
import { useLocalization, tn } from '../../Localization';
import { setIsLoadingAC } from '../../Loading/LoadingRedux';
import { SearchBar } from 'react-native-elements';
import VectorIcons from 'react-native-vector-icons/FontAwesome'


const HomeScreen = props => {
    const [masteredItemList, setMasteredItemList] = useState([]); ///
    const [filteredItemList, setFilteredItemList] = useState([]); ///
    const [isSearchTextEmpty, setIsSearchTextEmpty] = useState(true);
    //------------------------------------------------------------------------
    const themedColors = useThemedColors();
    const styles = getStyles(themedColors);

    const colors = useThemedColors(getStyles)

    const [editMode, setEditMode] = useState(false);
    const [search, setSearch] = useState('')
    const dispatch = useDispatch();
    const searchIcon = <VectorIcons name="search" size={30} color={colors[cn.searchBar.icon]}/>
    const loc = useLocalization();
    const _onPress_Add = () => {

        const addMode = changeMode(true);
        dispatch(addMode);
        props.navigation.navigate('routineAdd-screen')
    }
    const _onPress_Edit = item => {
        dispatch(setIsLoadingAC(true)); //loading modalı açılır
        const addMode = changeMode(false);
        dispatch(addMode);
        props.navigation.navigate('routineAdd-screen', { itemKey: item.key })

    }

    useEffect(() => {
        // subscribe
        const off = subscribeToItemData(data => {
            setMasteredItemList(data);
        });

        // unsubscribe
        return () => {
            off();
        }
    }, []);

    const searchFilterFunction = (text) => {
        //text varsa
        if (text) {
            //filtrelenmiş array oluşturuyoruz
            const newData = masteredItemList.filter(function (item) {
                const itemData = item.title
                    ? item.title.toUpperCase()
                    : ''.toUpperCase()
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1
            })
            //filtrelenmiş arrayi state'e atıyoruz
            setFilteredItemList(newData)
            setSearch(text);
        }
        else {
            setFilteredItemList(masteredItemList);
            setSearch(text);
        }
    }
    const onlongPress = (val) => {
        setEditMode(val)
    }

    //FlatList data propertysine filteredItemList verdiğimizde
    //anasayfanın ilk açıldığı durumda sanki hiç data yokmuş gibi gösteriyordu.
    //bunun için aşağıdakiler yapıldı


    //Arama inputu boş ise bütün listeyi getirsin.
    const itemList = isSearchTextEmpty ? masteredItemList : filteredItemList;

    //search state'indeki değerin girilmiş mi yoksa hiç girilmemiş mi bilgisi
    //SearchExists'te tutuluyor
    let SearchExists = false;
    if (search.length > 0) {
        SearchExists = true;
    }
    else {
        SearchExists = false;
    }

    //gereksiz re-render'lardan kaçınmak için
    useMemo(() => {
        if (SearchExists) {
            setIsSearchTextEmpty(false)
        }
        else {
            setIsSearchTextEmpty(true)
        }
    }, [SearchExists])

    
   //sadece, arama çubuğuna harfler girildiğinde filteredItemList güncellemesi tetikleniyor ve
   //arama yapılan veriyi silme/değiştirme işlemi sonrasında gerçek arama sonuçları gösterilmiyordu
   //artık masteredItemList değişince de filteredItemList güncellemesi tetiklenecek
    useEffect(() => {searchFilterFunction(search)}, [masteredItemList])

    const _render_Item = ({ item }) => {
        // item'e basıldığında id'sini gönderiyoruz
        return (
            <TouchableOpacity style={{ flex: 1 }}
            >
                <Item
                    onPress={() => _onPress_Edit(item)}
                    item={item}
                    onlongPress={(val) => onlongPress(val)}
                    editMode={editMode}
                >
                </Item>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <SearchBar
                searchIcon={searchIcon}
                placeholder={loc.t(tn.search)}
                placeholderTextColor= {colors[cn.searchBar.placeholderTextColor]}
                inputContainerStyle= {styles.searchBarInputContainer}
                containerStyle={styles.searchBarContainer}
                leftIconContainerStyle={styles.leftIconContainer}
                value={search}
                onChangeText={(text) => searchFilterFunction(text)}
                onClear={(text) => searchFilterFunction('')}
            />
            <View style={styles.container}>
                <FlatList
                    style={{ flexShrink: 1, flexGrow: 1 }}
                    data={itemList}
                    renderItem={_render_Item}
                    keyExtractor={item => item.key}
                    ListEmptyComponent={EmptyComponent}
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.addbuttonTouchable} onPress={_onPress_Add} >
                        <Icon svg={Svgs.Addbutton} iconStyle={{ color: themedColors[cn.header.background] }}></Icon>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>






    );

};


export default HomeScreen;