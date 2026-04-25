import { Routes } from '@/features/core/navigation';
import { DetailsBox } from '@/features/trips/ui/components/DetailsBox/DetailsBox';
import { EmptyListContainer } from '@/features/trips/ui/components/EmptyListContainer/EmptyListContainer';
import { HomeSkeleton } from '@/features/trips/ui/components/HomeSkeleton/HomeSkeleton';
import { useUpcomingTripPageLogic } from '@/features/trips/ui/pages/UpcomingTripPage/UpcomingTripPage.logic';
import { styles } from '@/features/trips/ui/pages/UpcomingTripPage/UpcomingTripPage.style';
import { CustomImage } from '@/ui/components/basic/CustomImage/CustomImage';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { View } from 'react-native';

const UpcomingTripPage = () => {
  const { lastCreatedTrip, isLoading, image, imageBlurHash, location, tripId, tripStartDate, totalTrips } =
    useUpcomingTripPageLogic();

  return (
    <BasicView nameView={Routes.HomePage} isFullScreen isMenuVisible statusBarStyle="light">
      {isLoading ? (
        <HomeSkeleton />
      ) : lastCreatedTrip ? (
        <View style={styles.container}>
          <CustomImage
            source={typeof image === 'string' ? { uri: image } : image}
            style={styles.image}
            placeholder={imageBlurHash ? { blurhash: imageBlurHash } : undefined}
          />
          <DetailsBox
            location={location}
            tripId={tripId}
            tripStartDate={tripStartDate}
            style={styles.detailsBox}
            totalTrips={totalTrips}
          />
        </View>
      ) : (
        <EmptyListContainer />
      )}
    </BasicView>
  );
};

export default UpcomingTripPage;
