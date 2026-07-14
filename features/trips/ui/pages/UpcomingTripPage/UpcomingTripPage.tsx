import { useRef } from 'react';
import { Platform, View } from 'react-native';
import { Routes } from '@/features/core/navigation';
import { BasicView, PlatformOS } from '@/features/core/ui';
import { DetailsBox } from '@/features/trips/ui/components/DetailsBox/DetailsBox';
import { EmptyListContainer } from '@/features/trips/ui/components/EmptyListContainer/EmptyListContainer';
import { HeroImage } from '@/features/trips/ui/components/HeroImage/HeroImage';
import { HomeSkeleton } from '@/features/trips/ui/components/HomeSkeleton/HomeSkeleton';
import { useUpcomingTripPageLogic } from '@/features/trips/ui/pages/UpcomingTripPage/UpcomingTripPage.logic';
import { styles } from '@/features/trips/ui/pages/UpcomingTripPage/UpcomingTripPage.style';

const basicViewProps = {
  nameView: Routes.HomePage,
  isFullScreen: true,
  isMenuVisible: true,
  statusBarStyle: 'light',
} as const;

export const UpcomingTripPage = () => {
  const {
    lastCreatedTrip,
    isLoading,
    image,
    imageBlurHash,
    location,
    tripId,
    tripStartDate,
    totalTrips,
    retryCoverImage,
  } = useUpcomingTripPageLogic();

  const blurTargetRef = useRef<View | null>(null);

  if (isLoading) {
    return (
      <BasicView {...basicViewProps}>
        <HomeSkeleton />
      </BasicView>
    );
  }

  if (!lastCreatedTrip) {
    return (
      <BasicView {...basicViewProps}>
        <EmptyListContainer />
      </BasicView>
    );
  }

  return (
    <BasicView {...basicViewProps}>
      <View style={styles.container}>
        <HeroImage
          image={image}
          imageBlurHash={imageBlurHash}
          blurTargetRef={blurTargetRef}
          onError={retryCoverImage}
        />
        <DetailsBox
          location={location}
          tripId={tripId}
          tripStartDate={tripStartDate}
          style={styles.detailsBox}
          totalTrips={totalTrips}
          blurTargetRef={Platform.OS === PlatformOS.android ? blurTargetRef : undefined}
        />
      </View>
    </BasicView>
  );
};
