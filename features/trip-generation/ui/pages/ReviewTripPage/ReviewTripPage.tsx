import { Routes } from '@/features/core/navigation';
import { SummaryCard } from '@/features/trip-generation/ui/components/SummaryCard/SummaryCard';
import { useReviewTripPageLogic } from '@/features/trip-generation/ui/pages/ReviewTripPage/ReviewTripPage.logic';
import { style } from '@/features/trip-generation/ui/pages/ReviewTripPage/ReviewTripPage.style';
import { CustomText } from '@/ui/components/basic/CustomText/CustomText';
import { LottieAnimation } from '@/ui/components/basic/LottieAnimation/LottieAnimation';
import { CustomScrollView } from '@/ui/components/composite/CustomScrollView/CustomScrollView';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { View } from 'react-native';

export const ReviewTripPage = () => {
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
