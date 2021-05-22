import React from 'react';
import { useEffect, useState } from 'react';
import { Text, TextInput, View, SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
//clean this code

import { useThemedColors } from '../../Theming';
import getStyles from '../styles/RoutuneAddStyles';

import { Locales, tn, useLocale, useLocalization } from '../../Localization';
import { cn } from '../../Theming';
import { useAddEditSelectors } from '../Redux/RoutineRedux';

import { addItem, getItemDetail, updateItem } from '../API/Firebase';
import { setIsLoadingAC } from '../../Loading/LoadingRedux';
import {setErrorCodeAC} from '../../Error/ErrorRedux';



const RoutineAddScreen = props => {

    const itemKey = props.route.params?.itemKey;

    const [itemName, setItemName] = useState('');
    const [itemRoutines, setItemRoutines] = useState('');

    const [todaydate, setDateToday] = useState('');
    const [endDate, setDateEnd] = useState('');

    const [emptyDate, setemptyDate] = useState(true);
    const [emptyDateEnd, setemptyDateEnd] = useState(true);

    const [date, setDate] = useState(new Date());
    const [dateEnd, setEndDate] = useState(new Date());


    const [mode, setMode] = useState('date');

    const [show, setShow] = useState(false);
    const [showEnd, setShowEnd] = useState(false);

    const loc = useLocalization();
    const locale = useLocale();

    const themedColors = useThemedColors();
    const styles = getStyles(themedColors);

    const dispatch=useDispatch();

    useEffect(() => {
        if (props.value !== undefined) {
            setDateToday(props.value)
        }
    }, [])

    // Ekrana gelen bir itemKey varsa, item'in detayları çekilsin
    useEffect(() => {
        if (itemKey) {
            dispatch(setIsLoadingAC(false));  //loading modalı kapanır

            getItemDetail(itemKey, item => {
                setemptyDate(false);
                setemptyDateEnd(false);
                setItemName(item.title);
                setDateToday(item.todayDate);
                setDateEnd(item.EndDate);
                setItemRoutines(item.routines);
            });
        }
    }, []);

    const todaysDate = () => {
        setemptyDate(false);
        console.log("bugün")
        if (locale === Locales.turkish) {
            setDateToday(moment().format('DD-MM-YYYY'))
            console.log(todaydate);
        }
        else {
            setDateToday(moment().format('MM-DD-YYYY'))
        }

    }


    const onChange = (event, selectedDate) => {

        if (event.type === 'dismissed') {
            setShow(false);
            setemptyDate(true);

        }

        else {

            const currentDate = selectedDate;
            setShow(Platform.OS === 'ios');
            setDate(currentDate);
            setDateToday(moment(currentDate).format('DD-MM-YYYY'))

        }
    };

    const onChangeEnd = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setShowEnd(false);
            setemptyDateEnd(true);

        }

        else {
            const currentDate = selectedDate;
            setShowEnd(Platform.OS === 'ios');
            setEndDate(currentDate);
            setDateEnd(moment(currentDate).format('DD-MM-YYYY'))

        }
    };

    const showMode = () => {
        setShow(true);
        setMode('date');
        setemptyDate(false);

    };

    const showModeEnd = () => {
        setShowEnd(true);
        setMode('date');
        setemptyDateEnd(false);

    };


    const addMode = useSelector(useAddEditSelectors);

    const isEmpty = () => {
        if (itemName.trim() === '' || todaydate.trim() === '' || endDate.trim() === '' || itemRoutines.trim() === '') {
            dispatch(setErrorCodeAC('emptySpace'));
            return false;
        }
        return true;
    }
    const _onPress_add_edit = () => {

        if (isEmpty() === true) {
            const item = {
                key: itemKey,
                title: itemName,
                todayDate: todaydate,
                EndDate: endDate,
                routines: itemRoutines,
            };
            const onComplete = () => {
                props.navigation.navigate('homepage-screen');
            }

            if (itemKey) {
                console.log('updating')
                updateItem(item, onComplete);
            }
            else {
                addItem(item, onComplete);
                // alert("Yeni Rutin Başarılı bir şekilde eklendi")

            }
        }

    }


    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>

                <View style={styles.RoutineContainer}>

                    <View style={styles.ViewInput}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={loc.t(tn.routineName)}
                            placeholderTextColor={themedColors[cn.auth.inputPlaceholder]}
                            numberOfLines={1}
                            value={itemName}
                            onChangeText={setItemName}
                        ></TextInput>
                    </View>

                    <View style={styles.ViewInput}>
                        <TouchableOpacity
                            style={styles.calendar}
                            onPress={showMode} >
                            <Text
                                style={[styles.datetextInput, { color: emptyDate ? themedColors[cn.auth.inputPlaceholder] : themedColors[cn.home.routinesText] }]}
                            >{
                                    emptyDate ?
                                        loc.t(tn.startDate) :
                                        todaydate
                                }

                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.today} onPress={todaysDate}>
                            <Text style={styles.todayText}>{loc.t(tn.today)}</Text>
                        </TouchableOpacity>
                    </View>

                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                    )}

                    <View style={styles.ViewInput}>
                        <TouchableOpacity
                            style={styles.calendar}
                            onPress={showModeEnd} >
                            <Text
                                style={[styles.datetextInput, { color: emptyDateEnd ? themedColors[cn.auth.inputPlaceholder] : themedColors[cn.home.routinesText] }]}
                            >{
                                    emptyDateEnd ?
                                        loc.t(tn.endDate) :
                                        endDate
                                }

                            </Text>
                        </TouchableOpacity>
                    </View>
                    {showEnd && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={dateEnd}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChangeEnd}
                        />
                    )}

                    <View style={styles.ViewInput}>
                        <TextInput
                            style={[styles.RoutineInput, styles.textInput]}
                            placeholder={loc.t(tn.routines)}
                            placeholderTextColor={themedColors[cn.auth.inputPlaceholder]}
                            value={itemRoutines}
                            multiline
                            onChangeText={setItemRoutines}

                        ></TextInput>
                    </View>

                </View>
                <TouchableOpacity style={styles.addTouchable} onPress={_onPress_add_edit}>
                    <Text style={styles.addText}>{addMode ? loc.t(tn.add) : loc.t(tn.edit)}</Text>
                </TouchableOpacity>

            </SafeAreaView>
        </View>

    );
};

export default RoutineAddScreen;
