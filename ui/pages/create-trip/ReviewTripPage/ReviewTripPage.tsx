import CustomText from '@/ui/components/basic/CustomText/CustomText';
import LottieAnimation from '@/ui/components/basic/LottieAnimation/LottieAnimation';
import CustomScrollView from '@/ui/components/composite/CustomScrollView/CustomScrollView';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { Routes } from '@/ui/constants/navigation/routes';
import { View } from 'react-native';
import { useReviewTripPageLogic } from './ReviewTripPage.logic';
import { style } from './ReviewTripPage.style';
import { SummaryCard } from './components/SummaryCard/SummaryCard';

const ReviewTripPage = () => {
  const { handleButtonPress, destination, dates, travelers, budget, animation } = useReviewTripPageLogic();

  return (
    <BasicView
      nameView={Routes.ReviewTrip}
      statusBarStyle="dark"
      bottomButtonTitle="REVIEW_TRIP.BUILD_TRIP"
      bottomButtonPress={handleButtonPress}
      viewStyle={style.container}
    >
      <CustomScrollView contentContainerStyle={style.contentScrollViewContainer}>
        <CustomText text="REVIEW_TRIP.DESCRIPTION" style={style.subtitle} />
        <View style={style.summaryContainer}>
          <SummaryCard destination={destination} dates={dates} travelers={travelers} budget={budget} />
        </View>
        <LottieAnimation style={style.animation} animationPath={animation} loop autoPlay />
      </CustomScrollView>
    </BasicView>
  );
};

export default ReviewTripPage;
