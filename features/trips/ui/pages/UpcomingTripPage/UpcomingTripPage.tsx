import { Routes } from '@/features/core/navigation';
import { BasicView, CustomImage, PlatformOS } from '@/features/core/ui';
import { DetailsBox } from '@/features/trips/ui/components/DetailsBox/DetailsBox';
import { EmptyListContainer } from '@/features/trips/ui/components/EmptyListContainer/EmptyListContainer';
import { HomeSkeleton } from '@/features/trips/ui/components/HomeSkeleton/HomeSkeleton';
import { useUpcomingTripPageLogic } from '@/features/trips/ui/pages/UpcomingTripPage/UpcomingTripPage.logic';
import { styles } from '@/features/trips/ui/pages/UpcomingTripPage/UpcomingTripPage.style';
import { BlurTargetView } from 'expo-blur';
import { useRef } from 'react';
import { Platform, View } from 'react-native';

export const UpcomingTripPage = () => {
  const { lastCreatedTrip, isLoading, image, imageBlurHash, location, tripId, tripStartDate, totalTrips } =
    useUpcomingTripPageLogic();

  const blurTargetRef = useRef<View | null>(null);

  return (
    <BasicView nameView={Routes.HomePage} isFullScreen isMenuVisible statusBarStyle="light">
      {isLoading ? (
        <HomeSkeleton />
      ) : lastCreatedTrip ? (
        <View style={styles.container}>
          {Platform.OS === PlatformOS.android ? (
            <BlurTargetView ref={blurTargetRef} style={styles.image}>
              <CustomImage
                source={typeof image === 'string' ? { uri: image } : image}
                style={styles.image}
                placeholder={imageBlurHash ? { blurhash: imageBlurHash } : undefined}
              />
            </BlurTargetView>
          ) : (
            <CustomImage
              source={typeof image === 'string' ? { uri: image } : image}
              style={styles.image}
              placeholder={imageBlurHash ? { blurhash: imageBlurHash } : undefined}
            />
          )}
          <DetailsBox
            location={location}
            tripId={tripId}
            tripStartDate={tripStartDate}
            style={styles.detailsBox}
            totalTrips={totalTrips}
            blurTargetRef={Platform.OS === PlatformOS.android ? blurTargetRef : undefined}
          />
        </View>
      ) : (
        <EmptyListContainer />
      )}
    </BasicView>
  );
};
