import React, { useState } from 'react';
import { Text, SafeAreaView, TouchableOpacity, View } from 'react-native';
import getStyles from '../styles/HomeScreenStyles';
import DummyData from './DummyData';
import Icon from '../../../Components/Icon';
import { Svgs } from '../../../StylingConstants';
import { deleteItem } from '../../RoutinePages/API/Firebase';

import { cn, useThemedColors } from '../../Theming';
import Modal from 'react-native-modal';
import RoutinesListModal from './RoutinesListModal';

const Item = props => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    // const [editMode, setEditMode] = useState(false);
    const [selectedRoutine, setSelection] = useState(null);
    const [routines, setRoutinesList] = useState(null);


    const themedColors = useThemedColors();
    const styles = getStyles(themedColors);

    const _onPress_Edit_Mode = () => {
        props.onlongPress(true);
    };

    const _onPress_Edit = (item) => {
        props.onPress(item.key)
    }
    const _onPress_Delete = (item) => {
        deleteItem(item.key);
    }

    const _onPress_RoutinesListModal = () => {
        if(props.editMode){
            props.onlongPress(false);
 
        }
       else{ setIsModalVisible(true)}
    }

    const _onPress_ModalBackdrop = () => {
        setIsModalVisible(false)
    }
    return (
        <View style={styles.textContainer}>
            <TouchableOpacity
                style={styles.touchButton}
                onPress={_onPress_RoutinesListModal}
                onLongPress={_onPress_Edit_Mode}
            >
                <Text style={styles.inputText}>{props.item.title}</Text>
            </TouchableOpacity>

            {
                props.editMode ?
                    <>
                        <TouchableOpacity style={styles.iconTouchable}
                            onPress={()=>_onPress_Edit(props.item)}>
                            <View style={styles.editbuttonView}>
                                <Icon svg={Svgs.Editbutton} iconStyle={{ color: themedColors[cn.header.background] }}></Icon>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconTouchable}
                            onPress={() => _onPress_Delete(props.item)}>
                            <View style={styles.editbuttonView}>
                                <Icon svg={Svgs.Deletebutton} iconStyle={{ color: themedColors[cn.home.trashiconColor] }}></Icon>
                            </View>
                        </TouchableOpacity>
                    </>
                    :
                    null}
            <Modal
                isVisible={isModalVisible}
                // arkaplana t??klay??nca fonksiyonu
                onBackdropPress={_onPress_ModalBackdrop}
                style={styles.modal}
                // a????l???? animasyonu
                animationIn="bounceIn"
                // kapan???? animasyonu
                animationOut="bounceOut"
                // a????l???? animasyon s??resi
                animationInTiming={100}
                // kapan???? animasyon s??resi
                animationOutTiming={300}
                // a????l???? arkaplan kararma s??res??
                backdropTransitionInTiming={1500}
                // arkaplan rengi
                backdropColor={'black'}
                // arkaplan opakl??k
                backdropOpacity={0.5}
            >
                <RoutinesListModal
                item={props.item}
                />
            </Modal>
        </View>

    );
};

export default Item;
