import React, { Component } from 'react';
import { View, Animated, SafeAreaView, ViewStyle, InteractionManager } from 'react-native';

// components
import { Button } from '@components';

import Localize from '@locale';

import { AppStyles } from '@theme';
import styles from './styles';
/* Types ==================================================================== */
interface Props {
    style: ViewStyle;
    pages: number;
    progress: Animated.Value;
    indicatorColor: string;
    indicatorOpacity: number;
    scrollTo: (index: number) => void;
    onFinish: () => void;
}

interface State {
    currentIndex: number;
}

export default class Indicator extends Component<Props, State> {
    currentIndex: number;

    constructor(props: Props) {
        super(props);

        this.state = {
            currentIndex: 1,
        };
    }

    componentDidMount() {
        const { progress } = this.props;

        InteractionManager.runAfterInteractions(() => {
            progress.addListener((obj) => {
                this.setState({
                    currentIndex: Math.floor(obj.value) + 1,
                });
            });
        });
    }

    componentWillUnmount() {
        const { progress } = this.props;
        progress.removeAllListeners();
    }

    renderSkipButton = () => {
        const { pages, scrollTo, onFinish } = this.props;
        const { currentIndex } = this.state;

        if (currentIndex < pages) {
            return (
                <Button
                    testID="skip-slider"
                    label={Localize.t('global.skip')}
                    rounded
                    onPress={() => {
                        scrollTo(pages);
                    }}
                    style={[AppStyles.rightSelf]}
                />
            );
        }
        return (
            <Button
                testID="ready-slider"
                label={Localize.t('global.ready')}
                rounded
                onPress={onFinish}
                style={[AppStyles.buttonGreen, AppStyles.rightSelf]}
            />
        );
    };

    render() {
        const { pages, progress, indicatorOpacity, style } = this.props;

        const dots = Array.from(new Array(pages), (page, index) => {
            const opacity = progress.interpolate({
                inputRange: [-Infinity, index - 1, index, index + 1, Infinity],
                outputRange: [indicatorOpacity, indicatorOpacity, 1.0, indicatorOpacity, indicatorOpacity],
            });

            const viewStyle = { opacity };

            return <Animated.View style={[styles.dot, viewStyle]} key={index} />;
        });

        return (
            <SafeAreaView style={[styles.container, style]}>
                <View style={[styles.leftContent]}>{dots}</View>
                <View style={[styles.rightContent]}>{this.renderSkipButton()}</View>
            </SafeAreaView>
        );
    }
}
