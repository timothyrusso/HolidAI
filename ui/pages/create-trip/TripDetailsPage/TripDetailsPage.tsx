import type { DayPlan } from '@/modules/trip/domain/dto/UserTripsDTO';
import AnimatedHeaderImage from '@/ui/components/composite/AnimatedHeaderImage/AnimatedHeaderImage';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { Routes } from '@/ui/constants/routes';
import { Fragment } from 'react';
import { SectionList, View } from 'react-native';
import { useTripDetailsPageLogic } from './TripDetailsPage.logic';
import { styles as stylesTripDetailsPage } from './TripDetailsPage.style';
import { DayItem } from './components/DayItem/DayItem';
import { HeaderIcons } from './components/HeaderIcons/HeaderIcons';
import { ListHeaderComponent } from './components/ListHeaderComponent/ListHeaderComponent';

export const TripDetailsPage = () => {
  const {
    title,
    allCoordinates,
    region,
    scrollOffsetY,
    handleScroll,
    sectionData,
    budgetNotes,
    transportationNotes,
    tripDetails,
    weather,
    isLoadingMainImage,
    id,
    imageUrl,
  } = useTripDetailsPageLogic();

  const styles = stylesTripDetailsPage(isLoadingMainImage);

  const separator = () => <View style={styles.separator} />;

  const renderItem = ({ item }: { item: DayPlan }) => <DayItem dayPlan={item} location={title} tripId={id} />;

  return (
    <Fragment>
      <AnimatedHeaderImage
        value={scrollOffsetY}
        imageUrl={imageUrl}
        title={title}
        headerIcons={<HeaderIcons />}
        isLoading={isLoadingMainImage}
      />
      <BasicView nameView={Routes.TripDetails} containerStyle={styles.basicViewContainer} isFullScreen>
        <SectionList
          sections={sectionData ?? []}
          keyExtractor={item => item.day.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.dayPlans}
          ItemSeparatorComponent={separator}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          style={styles.sectionList}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={() => (
            <ListHeaderComponent
              region={region}
              allCoordinates={allCoordinates}
              budgetNotes={budgetNotes}
              transportationNotes={transportationNotes}
              weather={weather}
              tripDetails={tripDetails}
            />
          )}
        />
      </BasicView>
    </Fragment>
  );
};
