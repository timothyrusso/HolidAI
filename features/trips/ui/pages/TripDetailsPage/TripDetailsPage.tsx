import { Routes } from '@/features/core/navigation';
import type { DayPlan } from '@/features/trips/domain/entities/DayPlan';
import { DayItem } from '@/features/trips/ui/components/DayItem/DayItem';
import { HeaderIcons } from '@/features/trips/ui/components/HeaderIcons/HeaderIcons';
import { ListHeaderComponent } from '@/features/trips/ui/components/ListHeaderComponent/ListHeaderComponent';
import { useTripDetailsPageLogic } from '@/features/trips/ui/pages/TripDetailsPage/TripDetailsPage.logic';
import { styles } from '@/features/trips/ui/pages/TripDetailsPage/TripDetailsPage.style';
import AnimatedHeaderImage from '@/ui/components/composite/AnimatedHeaderImage/AnimatedHeaderImage';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { Fragment } from 'react';
import { SectionList, type SectionListData, View } from 'react-native';

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
    currency,
  } = useTripDetailsPageLogic();

  const Separator = ({
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

  const renderItem = ({ item }: { item: DayPlan }) => (
    <DayItem dayPlan={item} location={title} tripId={id} currency={currency} />
  );

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
          SectionSeparatorComponent={Separator}
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
