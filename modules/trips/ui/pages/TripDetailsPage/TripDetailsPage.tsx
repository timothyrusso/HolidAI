import { Routes } from '@/features/core/navigation';
import type { DayPlan } from '@/modules/trips/domain/dto/UserTripsDTO';
import AnimatedHeaderImage from '@/ui/components/composite/AnimatedHeaderImage/AnimatedHeaderImage';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { Fragment } from 'react';
import { SectionList, type SectionListData, View } from 'react-native';
import { DayItem } from '../../components/DayItem/DayItem';
import { HeaderIcons } from '../../components/HeaderIcons/HeaderIcons';
import { ListHeaderComponent } from '../../components/ListHeaderComponent/ListHeaderComponent';
import { useTripDetailsPageLogic } from './TripDetailsPage.logic';
import { styles } from './TripDetailsPage.style';

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
    id,
    imageUrl,
    imageBlurHash,
    food,
  } = useTripDetailsPageLogic();

  const separator = ({
    trailingSection,
    leadingItem,
    trailingItem,
  }: {
    trailingSection: SectionListData<DayPlan> | null;
    leadingItem: DayPlan | null;
    trailingItem: DayPlan | null;
  }) => {
    const isFirstItemOfSection = !leadingItem && !!trailingItem;
    return trailingSection || isFirstItemOfSection ? <View style={styles.separator} /> : null;
  };

  const renderItem = ({ item }: { item: DayPlan }) => <DayItem dayPlan={item} location={title} tripId={id} />;

  return (
    <Fragment>
      <AnimatedHeaderImage
        value={scrollOffsetY}
        imageUrl={imageUrl}
        imageBlurHash={imageBlurHash}
        title={title}
        headerIcons={<HeaderIcons />}
      />
      <BasicView nameView={Routes.TripDetails} containerStyle={styles.basicViewContainer} isFullScreen>
        <SectionList
          sections={sectionData ?? []}
          keyExtractor={item => item.day.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.dayPlans}
          SectionSeparatorComponent={separator}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          style={styles.sectionList}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={
            <ListHeaderComponent
              region={region}
              allCoordinates={allCoordinates}
              budgetNotes={budgetNotes}
              transportationNotes={transportationNotes}
              weather={weather}
              tripDetails={tripDetails}
              food={food}
            />
          }
        />
      </BasicView>
    </Fragment>
  );
};
