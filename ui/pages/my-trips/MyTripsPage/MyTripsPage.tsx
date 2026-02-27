import { Routes } from '@/modules/navigation/domain/entities/routes';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { Image, View } from 'react-native';
import { useMyTripsPageLogic } from './MyTripsPage.logic';
import { styles } from './MyTripsPage.style';
import { DetailsBox } from './components/DetailsBox/DetailsBox';
import { EmptyListContainer } from './components/EmptyListContainer/EmptyListContainer';
import { HomeCustomHeader } from './components/HomeCustomHeader/HomeCustomHeader';
import { HomeSkeleton } from './components/HomeSkeleton/HomeSkeleton';

const MyTripsPage = () => {
  const { lastCreatedTrip, isLoading, image, location, days, budget, travelers, tripId, tripStartDate, totalTrips } =
    useMyTripsPageLogic();

  return (
    <BasicView nameView={Routes.MyTrips} isFullScreen isMenuVisible statusBarStyle="light">
      {isLoading ? (
        <HomeSkeleton />
      ) : lastCreatedTrip ? (
        <View style={styles.container}>
          {totalTrips > 0 && <HomeCustomHeader />}
          <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.image} />
          <DetailsBox
            location={location}
            days={days}
            budget={budget}
            travelers={travelers}
            tripId={tripId}
            tripStartDate={tripStartDate}
            style={styles.detailsBox}
          />
        </View>
      ) : (
        <EmptyListContainer />
      )}
    </BasicView>
  );
};

export default MyTripsPage;
