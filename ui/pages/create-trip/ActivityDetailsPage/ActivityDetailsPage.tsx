import { Routes } from '@/modules/navigation/domain/entities/routes';
import { ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import { CustomIconButtonLarge } from '@/ui/components/basic/CustomIconButton/CustomIconButtonLarge';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import AnimatedHeaderImage from '@/ui/components/composite/AnimatedHeaderImage/AnimatedHeaderImage';
import CustomScrollView from '@/ui/components/composite/CustomScrollView/CustomScrollView';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { icons } from '@/ui/style/icons';
import { Fragment } from 'react';
import { View } from 'react-native';
import { useActivityDetailsPageLogic } from './ActivityDetailsPage.logic';
import { styles as stylesFactory } from './ActivityDetailsPage.style';
import { ActivityDetailsBox } from './components/ActivityDetailsBox/ActivityDetailsBox';

export const ActivityDetailsPage = () => {
  const {
    scrollOffsetY,
    handleScroll,
    locationTitle,
    imageData,
    isImageLoading,
    mainDescription,
    activityInsights,
    goBackHandler,
    rating,
    bestTimeToVisit,
    ticketPricing,
    latitude,
    longitude,
  } = useActivityDetailsPageLogic();

  const styles = stylesFactory(isImageLoading);

  return (
    <Fragment>
      <AnimatedHeaderImage
        value={scrollOffsetY}
        imageUrl={imageData}
        title={locationTitle}
        isLoading={isImageLoading}
        chipsAlignment="flex-end"
        headerIcons={
          <CustomIconButtonLarge
            iconName={icons.arrowBack}
            iconSize={spacing.Fourfold}
            onPress={goBackHandler}
            style={styles.backIcon}
            buttonType={ButtonType.Tertiary}
          />
        }
      />
      <BasicView nameView={Routes.ActivityDetails} containerStyle={styles.basicViewContainer} isFullScreen>
        <CustomScrollView onScroll={handleScroll} style={styles.scrollView}>
          <View style={styles.container}>
            <ActivityDetailsBox
              rating={rating}
              bestTimeToVisit={bestTimeToVisit}
              ticketPricing={ticketPricing?.toString()}
              locationTitle={locationTitle}
              latitude={latitude}
              longitude={longitude}
            />
            {mainDescription && <CustomText text={mainDescription} style={styles.description} />}
            {activityInsights && (
              <View style={styles.insightsContainer}>
                <View style={styles.insightHeader}>
                  <CustomIcon name={icons.diamond} size={spacing.Triple} color={colors.primaryBlack} />
                  <CustomText text="ACTIVITY_DETAILS.USEFUL_TIPS" style={styles.insightTitle} />
                </View>
                <CustomText text={activityInsights} style={styles.insightDescription} />
              </View>
            )}
          </View>
        </CustomScrollView>
      </BasicView>
    </Fragment>
  );
};
