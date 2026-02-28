import { Routes } from '@/modules/navigation/domain/entities/routes';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { Image, View } from 'react-native';
import { DetailsBox } from '../../components/DetailsBox/DetailsBox';
import { EmptyListContainer } from '../../components/EmptyListContainer/EmptyListContainer';
import { HomeSkeleton } from '../../components/HomeSkeleton/HomeSkeleton';
import { useMyTripsPageLogic } from './MyTripsPage.logic';
import { styles } from './MyTripsPage.style';

const MyTripsPage = () => {
  const { lastCreatedTrip, isLoading, image, location, tripId, tripStartDate, totalTrips } = useMyTripsPageLogic();

  return (
    <BasicView nameView={Routes.MyTrips} isFullScreen isMenuVisible statusBarStyle="light">
      {isLoading ? (
        <HomeSkeleton />
      ) : lastCreatedTrip ? (
        <View style={styles.container}>
          <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.image} />
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

export default MyTripsPage;
